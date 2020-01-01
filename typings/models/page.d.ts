import { ShopifyObject } from "./base";

export interface Page extends ShopifyObject {
    created_at?: string
    published_at?: string
    updated_at?: string
    author?: string
    body_html?: string
    handle?: string
    metafield?: any
    template_suffix?: string
    title?: string
}