declare var process: { env: any; };

const config: { [prop: string]: string } = process.env;

// Grab secret keys
const apiKey = config["shopify_prime_apiKey"] || config["apiKey"];
const secretKey = config["shopify_prime_secretKey"] || config["secretKey"];
const shopDomain = config["shopify_prime_shopDomain"] || config["shopDomain"];
const accessToken = config["shopify_prime_accessToken"] || config["accessToken"];

if (!apiKey) {
    throw new Error(`Expected 'apiKey' in process.env to exist.`);
}

if (!secretKey) {
    throw new Error(`Expected 'secretKey' in process.env to exist.`);
}

if (!shopDomain) {
    throw new Error(`Expected 'shopDomain' in process.env to exist.`);
}

if (! /https:\/\//.test(shopDomain)) {
    throw new Error(`Expected 'shopDomain' to be a full URL with 'https://' protocol.`);
}

if (!accessToken) {
    throw new Error(`Expected 'accessToken' in process.env to exist.`);
}

export { apiKey, secretKey, shopDomain, accessToken };

export function createGuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}