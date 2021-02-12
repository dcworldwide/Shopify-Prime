import { ShopifyObject } from "./base";
import { RefundLineItem } from "./refund_line_item";
import { Transaction } from "./transaction";

export interface Refund extends ShopifyObject {
    id: number;
    order_id: any;
    created_at?: string;
    note: string;
    restock?: boolean;
    user_id: number;
    processed_at?: string;
    refund_line_items: RefundLineItem[];
    transactions: Transaction[];
    order_adjustments: OrderAdjustment[];
}

export interface OrderAdjustment extends ShopifyObject {
    order_id: any;
    refund_id: number;
    amount: string;
    tax_amount: string;
    kind: string;
    reason: string;
}
