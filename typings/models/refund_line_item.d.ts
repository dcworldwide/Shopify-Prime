import { ShopifyObject } from "./base";
import { LineItem } from "./line_item";

export interface RefundLineItem extends ShopifyObject {
    line_item_id?: string;
    line_item?: LineItem;
    quantity?: number;
    restock_type?: string;
    subtotal?: string;
    total_tax?: string;
}