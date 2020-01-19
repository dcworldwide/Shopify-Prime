import BaseService from "../infrastructure/base_service";
import { InventoryItem } from "../typings/models/inventory_item";
import { FieldOptions, ListOptions } from "../typings/options/base";


export default class InventoryItems extends BaseService {
    constructor(shopDomain: string, accessToken: string) {
        super(shopDomain, accessToken, "inventory_items");
    }

    /**
     * Gets a list of up to 250 of the shop's InventoryItems.
     * @param options Options for filtering the results.
     */
    public list(options?: { ids: string } & ListOptions) {
        return this.createRequest<InventoryItem[]>("GET", ".json", "inventory_items", options);
    }

    /**
     * Gets the InventoryItem with the given id.
     * @param id The InventoryItem's id.
     * @param options Options for filtering the results.
     */
    public get(id: number, options?: FieldOptions) {
        return this.createRequest<InventoryItem>("GET", `${id}.json`, "inventory_item", options);
    }

    /**
     * Updates an InventoryItem with the given id.
     * @param id The InventoryItem's id.
     * @param InventoryItem The updated InventoryItem.
     */
    public update(id: number, item: InventoryItem) {
        return this.createRequest<InventoryItem>("PUT", `${id}.json`, "inventory_item", { inventory_item: item })
    }
}