import { ShopifyObject } from "./base";

/**
 * @see https://shopify.dev/docs/admin-api/rest/reference/customers/customersavedsearch
 */
export interface CustomerSavedSearch extends ShopifyObject {
    name: string
    query: string
    created_at?: string
    updated_at?: string
}