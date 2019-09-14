import uri = require("jsuri");
import fetch from "node-fetch";
import { resolve } from "path";
import ShopifyError from "./shopify_error";
const Bottleneck = require("bottleneck");

/**
 * Rate limit is 1 request per 0.5 seconds per store.
 */
const rateLimit = 1000 / 2

//Get package.json from 2-levels up as this file will be in dist/infrastructure.
const version = require(resolve(__dirname, "../../package.json")).version;
const debug = process.env.SHOPIFY_PRIME_DEBUG && process.env.SHOPIFY_PRIME_DEBUG == "true"

// Rate limit requests
// https://github.com/SGrondin/bottleneck
const limiterProxy = new Bottleneck.Group({
    maxConcurrent: null,
    minTime: rateLimit
});

if (debug) {

    // The 'created' event is triggered only once per limiter
    limiterProxy.on('created', (limiter, key) => {

        limiter.on('dropped', (dropped) => {
            console.warn("Dropped IC request", dropped)
        })

        limiter.on('debug', function (message, data) {
            console.log(message, data)
        })
    })
}

let jobId = 0

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

        //Ensure resource starts with admin/
        if (!/^[\/]?admin\//ig.test(resource)) {
            this.resource = `admin/api/${version}/${resource}`
        }
    }

    public static buildDefaultHeaders() {
        const headers = {
            "Accept": "application/json",
            "User-Agent": `Shopify Prime ${version} (https://github.com/nozzlegear/shopify-prime)`
        }

        return headers;
    }

    protected createRequest<T>(method: "GET" | "POST" | "PUT" | "DELETE", path: string, rootElement?: string, payload?: Object) {

        return new Promise<T>((resolve, reject) => {

            let limiter = limiterProxy.key(this.shopDomain)

            jobId = jobId >= Number.MAX_SAFE_INTEGER ? 1 : jobId++

            let jobOpts = {
                priority: 5,
                weight: 1,
                expiration: null,
                id: jobId
            }

            limiter.schedule(jobOpts, async () => {

                debug && console.log(`${method} ${this.resource}/${path}`)

                method = method.toUpperCase() as any;

                const opts = {
                    headers: BaseService.buildDefaultHeaders(),
                    method: method,
                    body: undefined as string,
                }

                if (this.accessToken) {
                    opts.headers["X-Shopify-Access-Token"] = this.accessToken;
                }

                const url = new uri(this.shopDomain);
                url.protocol("https");

                //Ensure no erroneous double slashes in path and that it doesn't end in /.json
                url.path(`${this.resource}/${path}`.replace(/\/+/ig, "/").replace(/\/\.json/ig, ".json"));

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

                debug && console.debug(url.toString(), opts)

                //Fetch will only throw an exception when there is a network-related error, not when Shopify returns a non-200 response.
                const result = await fetch(url.toString(), opts);

                // Shopify implement 204 - no content for DELETE requests 
                if (result.status == 204) {
                    return resolve()
                }

                let json = await result.text() as any;

                try {
                    json = JSON.parse(json);
                } catch (e) {
                    //Set ok to false to throw an error with the body's text.
                    result.ok = false;
                }

                if (!result.ok) {
                    throw new ShopifyError(result, json);
                }

                resolve(rootElement ? json[rootElement] as T : json as T)

            }).catch(err => {
                debug && console.error(err)
                reject(err)
            })
        })
    }
}

export default BaseService;