import { ShopifyObject } from "./base";

export interface Province extends ShopifyObject {
    code: string;
    country_id: number;
    name: string;
    tax: number;
    tax_name: string;
    tax_type: string;
    tax_percentage: number;
}

// @see https://help.shopify.com/en/api/reference/store-properties/country?api[version]=2019-04#index-2019-04
export interface Country extends ShopifyObject {
    code?: string;
    name?: string;
    tax?: number;
    provinces?: Province[]
}