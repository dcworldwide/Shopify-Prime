import { ShopifyObject } from "./base";

/**
 * @see https://help.shopify.com/en/api/reference/inventory/inventoryitem
 */
export interface InventoryItem extends ShopifyObject {
    cost: string;
    country_code_of_origin?: string;
    country_harmonized_system_codes?: any;
    harmonized_system_code?: number;
    grams: number;
    province_code_of_origin?: string;
    sku: string;
    tracked: boolean;
    requires_shipping: boolean;
}