import { DateOptions, FieldOptions, ListOptions } from "./base";

export interface CustomerListOptions extends FieldOptions, DateOptions, ListOptions {
    /**
     * A comma-separated list of customer ids.
     */
    ids?: string | string[] | number[];
}

export interface CustomerSearchOptions extends FieldOptions, ListOptions {

    /**
     * Set the field and direction by which to order results. default: last_order_date DESC
     */
    order: string

    /**
     * Text to search for in the shop's customer data.
     * 
     * Supported queries: accepts_marketing, activation_date, address1, address2, city, company, country, customer_date, customer_first_name, customer_id, customer_last_name, customer_tag, email, email_marketing_state, first_name, first_order_date, id, last_abandoned_order_date, last_name, multipass_identifier, orders_count, order_date, phone, province, shop_id, state, tag, total_spent, updated_at, verified_email, product_subscriber_status
     */
    query?: string
}

export interface CustomerSavedSearchListOptions extends FieldOptions, ListOptions {

}