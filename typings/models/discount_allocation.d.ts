import { ShopifyObject } from "./base";

export interface DiscountAllocation extends ShopifyObject {
    amount: string
    discount_application_index: number
    amount_set: {
        shop_money: {
            amount: string
            currency_code: string
        }
        presentment_money: {
            amount: string
            currency_code: string
        }
    }
}