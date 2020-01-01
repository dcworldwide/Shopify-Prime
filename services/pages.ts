import BaseService from "../infrastructure/base_service";
import { Page } from "../typings/models/page";
import { DateOptions, FieldOptions, ListOptions, PublishedOptions } from "../typings/options/base";


export default class Pages extends BaseService {
    constructor(shopDomain: string, accessToken: string) {
        super(shopDomain, accessToken, "pages");
    }

    /**
     * Gets a count of all of the shop's Pages.
     * @param options Options for filtering the results.
     * @see https://help.shopify.com/api/reference/page#count
     */
    public count(options?: DateOptions & PublishedOptions) {
        return this.createRequest<number>("GET", "count.json", "count", options);
    }

    /**
     * Gets a list of up to 250 of the shop's Pages.
     * @param options Options for filtering the results.
     */
    public list(options?: ListOptions & FieldOptions & PublishedOptions) {
        return this.createRequest<Page[]>("GET", ".json", "pages", options);
    }

    /**
     * Gets the Page with the given id.
     * @param pageId The Page's id.
     * @param options Options for filtering the results.
     */
    public get(pageId: number, options?: FieldOptions) {
        return this.createRequest<Page>("GET", `${pageId}.json`, "page", options);
    }

    /**
     * Creates an Page.
     * @param Page The Page being created.
     * @param options Options for creating the Page.
     */
    public create(page: Page) {
        return this.createRequest<Page>("POST", ".json", "page", { page: page })
    }

    /**
     * Updates an Page with the given id.
     * @param id The Page's id.
     * @param Page The updated Page.
     */
    public update(id: number, page: Page) {
        return this.createRequest<Page>("PUT", `${id}.json`, "page", { page: page })
    }

    /**
     * Deletes an Page with the given id.
     * @param id The Page's id.
     */
    public delete(id: number) {
        return this.createRequest<void>("DELETE", `${id}.json`);
    }
}