import { ShopifyObject } from "./base";

export interface PriceRuleDiscountCode extends ShopifyObject {

    /** 
     * The unique identifier for the price rule associated to the discount code.
     */
    price_rule_id?: number;

    /** 
     * The case-insensitive discount code that customers use at checkout. Required 
     * when creating a discount. Maximum length of 255 characters.
     */
    code?: string;

    /** 
     * The discount code usage count. Note that the usage limit is set on the price rule.
     */
    usage_count?: number

    /** 
     * By default, this auto-generated property is the date and time when the price rule was 
     * created in Shopify, in ISO 8601 format.
     */
    created_at?: string

    /** 
     * The date and time the discount code was updated.
     */
    updated_at?: string
}


export interface DiscountCodeBatchJob {
    id: number
    price_rule_id: number
    started_at?: Date
    completed_at?: Date
    created_at: Date
    updated_at: Date
    status: "queued" | "completed"
    codes_count: number
    imported_count: number
    failed_count: number
}

export interface DiscountCodeBatchJobCode {
    id: number
    code: string
    errors: {
        [index: string]: string[]
    }
}