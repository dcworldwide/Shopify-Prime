import BaseService from "../infrastructure/base_service";
import { Customer } from "../typings/models/customer";
import { CustomerSavedSearch } from "../typings/models/customer_saved_search";
import { FieldOptions } from "../typings/options/base";
import { CustomerSavedSearchListOptions } from "../typings/options/customers";

export default class CustomerSavedSearches extends BaseService {

    constructor(shopDomain: string, accessToken: string) {
        super(shopDomain, accessToken, "customer_saved_searches");
    }

    public count() {
        return this.createRequest<number>("GET", "count.json", "count");
    }

    public list(options?: CustomerSavedSearchListOptions) {
        return this.createRequest<CustomerSavedSearch[]>("GET", ".json", "customer_saved_searches", options);
    }

    public get(id: number, options?: FieldOptions) {
        return this.createRequest<CustomerSavedSearch>("GET", `${id}.json`, "customer_saved_search", options);
    }

    public getCustomers(id: number, options?: FieldOptions) {
        return this.createRequest<Customer[]>("GET", `${id}/customers.json`, "customers", options);
    }

    public create(name: string, query: string) {
        return this.createRequest<CustomerSavedSearch>("POST", ".json", "customer_saved_search", { name, query });
    }

    public update(id: number, name: string, query: string) {
        return this.createRequest<CustomerSavedSearch>("PUT", `${id}.json`, "customer_saved_search", { id, name, query });
    }

    public delete(id: number) {
        return this.createRequest<void>("DELETE", `${id}.json`);
    }
}