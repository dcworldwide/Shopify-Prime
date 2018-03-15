import { PriceRuleDiscountCode, DiscountCodeBatchJob, DiscountCodeBatchJobCode } from "../typings/models/price_rule_discount_code";
import BaseService from "../infrastructure/base_service";
import { FieldOptions, ListOptions } from "../typings/options/base";

/**
 * A service for manipulating Shopify Price Rules.
 */
export default class PriceRuleDiscounts extends BaseService {

    private prId: number

    constructor(shopDomain: string, accessToken: string, prId: number) {
        super(shopDomain, accessToken, "");
        this.prId = prId
    }

    /**
     * Returns a list of discount codes belonging to a specified price rule.
     * @param options Options for filtering the results.
     */
    public list(options?: ListOptions) {
        return this.createRequest<PriceRuleDiscountCode[]>("GET", `price_rules/${this.prId}/discount_codes.json`, "discount_codes", options);
    }

    /**
     * Creates a new discount code for a given price rule.
     * Note: Currently, you can only create a single discount code per price rule.
     */
    public create(discount: PriceRuleDiscountCode) {
        return this.createRequest<PriceRuleDiscountCode>("POST", `price_rules/${this.prId}/discount_codes.json`, "discount_code", { discount_code: discount });
    }

    /**
     * Returns details about a single discount code object.
     */
    public get(id: number) {
        return this.createRequest<PriceRuleDiscountCode>("GET", `price_rules/${this.prId}/discount_codes/${id}.json`, "discount_code");
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
        return this.createRequest<PriceRuleDiscountCode>("PUT", `price_rules/${this.prId}/discount_codes/${id}.json`, "discount_code", { discount_code: discount });
    }

    /**
     * Deletes an existing discount code object.
     */
    public delete(id: number) {
        return this.createRequest<void>("DELETE", `price_rules/${this.prId}/discount_codes/${id}.json`);
    }

    /**
     * Create a discount code creation job. The batch endpoint can be used to asynchronously 
     * create up to 100 discount codes in a single request. It enqueues and returns a discount_code_creation 
     * object that can be monitored for completion.
     * 
     * @param codes 
     */
    public createBatch(codes: { code: string }[]) {

        if (codes.length > 100) {
            throw new Error("The batch endpoint can be used to asynchronously create up to 100 discount codes in a single request")
        }

        return this.createRequest<DiscountCodeBatchJob>("POST", `price_rules/${this.prId}/batch.json`, "discount_code_creation", { discount_codes: codes });
    }

    /**
     * Retrieve a discount code creation job
     * 
     * @param batchId 
     */
    public getBatch(batchId: number) {
        return this.createRequest<DiscountCodeBatchJob>("GET", `price_rules/${this.prId}/batch/${batchId}.json`, "discount_code_creation");
    }

    /**
     * Retrieve a list of discount codes associated with the discount code creation job. Discount codes 
     * that have been successfully created include a populated ID field. Discount codes that encountered 
     * errors during the creation process include a populated errors field.
     * 
     * @param batchId 
     */
    public getBatchCodes(batchId: number) {
        return this.createRequest<DiscountCodeBatchJobCode[]>("GET", `price_rules/${this.prId}/batch/${batchId}/discount_codes.json`, "discount_codes");
    }
}
