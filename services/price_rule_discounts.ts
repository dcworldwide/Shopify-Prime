import { PriceRuleDiscountCode } from "../typings/models/price_rule_discount_code";
import BaseService from "../infrastructure/base_service";

// Enums 
import { FieldOptions, ListOptions } from "../typings/options/base";

/**
 * A service for manipulating Shopify Price Rules.
 */
export default class PriceRuleDiscounts extends BaseService {

    private priceRuleId: number

    constructor(shopDomain: string, accessToken: string, priceRuleId: number) {
        super(shopDomain, accessToken, ``);
        this.priceRuleId = priceRuleId
    }

    /**
     * Returns a list of discount codes belonging to a specified price rule.
     * @param options Options for filtering the results.
     */
    public list(options?: ListOptions) {
        return this.createRequest<PriceRuleDiscountCode[]>("GET", `price_rules/${this.priceRuleId}/discount_codes.json`, "discount_codes", options);
    }

    /**
     * Creates a new discount code for a given price rule.
     * Note: Currently, you can only create a single discount code per price rule.
     */
    public create(discount: PriceRuleDiscountCode) {
        return this.createRequest<PriceRuleDiscountCode>("POST", `price_rules/${this.priceRuleId}/discount_codes.json`, "discount_code", { discount_code: discount });
    }

    /**
     * Returns details about a single discount code object.
     */
    public get(id: number) {
        return this.createRequest<PriceRuleDiscountCode>("GET", `price_rules/${this.priceRuleId}/discount_codes/${id}.json`, "discount_code");
    }

    /**
     * Search by discount code.
     * 
     * The lookup endpoint does not return the discount code object, rather it returns the location of the 
     * discount code in the location header. Depending on your HTTP client, it may follow the location 
     * header automatically.
     * 
     * // https://your-store-domain.myshopify.com/admin/discount_codes/lookup?code=discountCode
     */
    public lookup(code: string) {
        return this.createRequest<PriceRuleDiscountCode>("GET", `discount_codes/lookup?code=${code}`, "discount_code");
    }

    /**
     * Updates a single discount code for a given price rule.
     */
    public update(id: number, discount: PriceRuleDiscountCode) {
        return this.createRequest<PriceRuleDiscountCode>("PUT", `price_rules/${this.priceRuleId}/discount_codes/${id}.json`, "discount_code", { discount_code: discount });
    }

    /**
     * Deletes an existing discount code object.
     */
    public delete(id: number) {
        return this.createRequest<void>("DELETE", `price_rules/${this.priceRuleId}/discount_codes/${id}.json`);
    }
}
