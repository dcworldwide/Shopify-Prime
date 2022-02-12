import BaseService from "../infrastructure/base_service";
import { Customer } from "../typings/models/customer";
// Enums
import { FieldOptions } from "../typings/options/base";
import { CustomerListOptions, CustomerSearchOptions } from "../typings/options/customers";


export default class Customers extends BaseService {

    constructor(shopDomain: string, accessToken: string) {
        super(shopDomain, accessToken, "customers");
    }

    /**
     * Gets a count of all of the shop's customers.
     * @param options Options for filtering the results.
     */
    public count() {
        return this.createRequest<number>("GET", "count.json", "count");
    }

    /**
     * Gets a list of up to 250 of the shop's customers.
     * @param options Options for filtering the results.
     */
    public list(options?: CustomerListOptions) {
        return this.createRequest<Customer[]>("GET", ".json", "customers", options);
    }

    /**
     * Gets a list of up to 250 customers from the given customer.
     * @param options Options for filtering the results.
     */
    public search(options?: CustomerSearchOptions) {
        return this.createRequest<Customer[]>("GET", "search.json", "customers", options);
    }

    /**
     * Gets the customer with the given id.
     * @param customerId The customer's id.
     * @param options Options for filtering the results.
     */
    public get(customerId: number, options?: FieldOptions) {
        return this.createRequest<Customer>("GET", `${customerId}.json`, "customer", options);
    }

    /**
     * Creates an customer.
     * @param customer The customer being created.
     * @param options Options for creating the customer.
     */
    public create(customer: Customer) {
        return this.createRequest<Customer>("POST", ".json", "customer", { customer });
    }

    /**
     * Updates an customer with the given id.
     * @param id The customer's id.
     * @param customer The updated customer.
     */
    public update(id: number, customer: Customer) {
        return this.createRequest<Customer>("PUT", `${id}.json`, "customer", { customer });
    }

    /**
     * Deletes an customer with the given id.
     * @param id The customer's id.
     */
    public delete(id: number) {
        return this.createRequest<void>("DELETE", `${id}.json`);
    }
}