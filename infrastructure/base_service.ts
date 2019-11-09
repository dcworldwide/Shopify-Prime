import uri = require("jsuri");
import fetch, { Response } from "node-fetch";
import { resolve } from "path";
import ShopifyError from "./shopify_error";
const Bottleneck = require("bottleneck");
const uuid = require('uuid/v4');

const version = require(resolve(__dirname, "../../package.json")).version; // Get package.json from 2-levels up as this file will be in dist/infrastructure.
const logLevel = !!process.env.SHOPIFY_PRIME_LOG_LEVEL ? parseInt(process.env.SHOPIFY_PRIME_LOG_LEVEL) : 0
const debug = logLevel == 1 || logLevel == 2
const debugRateLimiter = logLevel == 2

const RETRY_RATE = 1000
const API_CALL_LIMIT = "X-Shopify-Shop-Api-Call-Limit"
const RETRY_AFTER = "Retry-After"

export function uid() {
    return uuid()
}

function log(...x) {
    if (debug) {
        console.info.apply(this, arguments)
    }
}

function warn(...x) {
    console.info.apply(this, arguments)
}

function error(...x) {
    console.error.apply(this, arguments)
}

function wait(duration = 1000) {
    return new Promise(async (resolve) => {
        setTimeout(() => {
            resolve()
        }, duration)
    })
}

// Rate limit requests ( 1 request per 0.5 seconds per store)
// https://github.com/SGrondin/bottleneck
const rateLimit = 1000 / 2

const limiterProxy = new Bottleneck.Group({
    maxConcurrent: null,
    minTime: rateLimit
})

if (debugRateLimiter) {

    // The 'created' event is triggered only once per limiter
    limiterProxy.on('created', (limiter, key) => {

        limiter.on('dropped', (dropped) => {
            log("Dropped IC request", dropped)
        })

        limiter.on('debug', (message, data) => {
            log(message, data)
        })
    })
}

interface RequestOptions {
    headers: {
        "Accept": string
        "User-Agent": string
        "X-Shopify-Access-Token"?: string
    }
    method: "GET" | "POST" | "PUT" | "DELETE"
    body: undefined | string
}

class BaseService {

    private shopDomain: string
    private accessToken: string
    private resource: string
    private version: string

    constructor(shopDomain: string, accessToken: string, resource: string, version: string = "2019-04") {

        this.shopDomain = shopDomain
        this.accessToken = accessToken
        this.resource = resource
        this.version = version

        if (!/^[\/]?admin\//ig.test(resource)) {
            if (resource.toLowerCase().indexOf("oauth") > -1) {
                this.resource = "admin/" + resource
            } else {
                this.resource = `admin/api/${version}/${resource}`
            }
        }
    }

    public static buildDefaultHeaders() {
        const headers = {
            "Accept": "application/json",
            "User-Agent": `Shopify Prime ${version} (https://github.com/nozzlegear/shopify-prime)`
        }

        return headers;
    }


    /**
     * Fetch will only throw an exception when there is a network-related error, not when Shopify returns a non-200 response.
     * 
     * @param url 
     * @param opts 
     */
    private async execute(url: Uri, opts: RequestOptions) {
        log(opts.method, url.toString())
        // log(opts)
        return fetch(url.toString(), opts)
    }

    protected createRequest<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, rootElement?: string, payload?: Object) {

        return new Promise<T>((resolve, reject) => {

            let limiter = limiterProxy.key(this.shopDomain)

            let jobOpts = {
                priority: 5,
                weight: 1,
                expiration: null,
                id: uid()
            }

            limiter.schedule(jobOpts, async () => {

                //Ensure no erroneous double slashes in path and that it doesn't end in /.json
                let resourcePath = `${this.resource}/${path}`.replace(/\/+/ig, "/").replace(/\/\.json/ig, ".json")
                method = method.toUpperCase() as any;

                const opts: RequestOptions = {
                    headers: BaseService.buildDefaultHeaders(),
                    method: method,
                    body: undefined as string,
                }

                if (this.accessToken) {
                    opts.headers["X-Shopify-Access-Token"] = this.accessToken;
                }

                const url = new uri(this.shopDomain);
                url.protocol("https");
                url.path(resourcePath);

                if ((method === "GET" || method === "DELETE") && payload) {

                    for (const prop in payload) {
                        const value = payload[prop];

                        //Shopify expects qs array values to be joined by a comma, e.g. fields=field1,field2,field3
                        url.addQueryParam(prop, Array.isArray(value) ? value.join(",") : value);
                    }

                } else if (payload) {

                    opts.body = JSON.stringify(payload);
                    opts.headers["Content-Type"] = "application/json";

                }

                let res: Response
                let json: string

                try {

                    res = await this.execute(url, opts)
                    log(res.status)

                    if (res.status == 204) {
                        return resolve()
                    }

                    if (res.status == 429) {

                        // Wait & retry 
                        let retry = RETRY_RATE

                        if (res.headers.has(API_CALL_LIMIT)) {
                            log(API_CALL_LIMIT, res.headers.get(API_CALL_LIMIT))
                        }

                        if (res.headers.has(RETRY_AFTER)) {
                            try {
                                retry = parseFloat(res.headers.get(RETRY_AFTER))
                                if (isNaN(retry)) {
                                    retry = RETRY_RATE
                                }
                            }
                            catch (err) { }
                        }

                        log("429. Waiting", retry)
                        await wait(retry)
                        res = await this.execute(url, opts)
                        log(res.status)

                        if (res.status == 204) {
                            return resolve()
                        }
                    }

                    json = await res.text()

                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        res.ok = false; // Set ok to false to throw an error with the body's text.
                    }

                    if (!res.ok) {
                        throw new ShopifyError(res, json as any);
                    }

                    resolve(rootElement ? json[rootElement] as T : json as any)

                } catch (err) {
                    throw new ShopifyError(res, json as any)
                }

            }).catch(err => {
                log(err)
                reject(err)
            })
        })
    }
}

export default BaseService;