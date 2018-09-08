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
}
