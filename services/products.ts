import BaseService from "../infrastructure/base_service";
import { Product } from "../typings/models/product";
import { FieldOptions } from "../typings/options/base";
import { ProductCountOptions, ProductListOptions } from "../typings/options/products";


export default class Products extends BaseService {
    constructor(shopDomain: string, accessToken: string) {
        super(shopDomain, accessToken, "products");
    }

    /**
     * Gets a count of all of the shop's Products.
     * @param options Options for filtering the results.
     * @see https://help.shopify.com/api/reference/product#count
     */
    public count(options?: ProductCountOptions) {
        return this.createRequest<number>("GET", "count.json", "count", options);
    }

    /**
     * Gets a list of up to 250 of the shop's Products.
     * @param options Options for filtering the results.
     */
    public list(options?: ProductListOptions) {
        return this.createRequest<Product[]>("GET", ".json", "products", options);
    }

    /**
     * Gets the Product with the given id.
     * @param productId The Product's id.
     * @param options Options for filtering the results.
     */
    public get(productId: number, options?: FieldOptions) {
        return this.createRequest<Product>("GET", `${productId}.json`, "product", options);
    }

    /**
     * Creates an Product.
     * @param Product The Product being created.
     * @param options Options for creating the Product.
     */
    public create(product: Product) {
        return this.createRequest<Product>("POST", ".json", "product", { product: product })
    }

    /**
     * Updates an Product with the given id.
     * @param id The Product's id.
     * @param Product The updated Product.
     */
    public update(id: number, product: Product) {
        return this.createRequest<Product>("PUT", `${id}.json`, "product", { product: product })
    }

    /**
     * Deletes an Product with the given id.
     * @param id The Product's id.
     */
    public delete(id: number) {
        return this.createRequest<void>("DELETE", `${id}.json`);
    }
}