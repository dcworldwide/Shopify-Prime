import { expect } from "chai";
import * as config from "./_utils";
import { PriceRules, PriceRuleDiscounts, Models } from "shopify-prime-dc";
import PriceRule = Models.PriceRule;
import PriceRuleDiscountCode = Models.PriceRuleDiscountCode;

describe("Price Rules", function () {

    this.timeout(60000);

    const prService: PriceRules = new PriceRules(config.shopDomain, config.accessToken);
    const prToBeDeleted: PriceRule[] = [];
    const dcToBeDeleted: { [prId: number]: PriceRuleDiscountCode[] } = {};

    function mockPriceRule() {
        const pr: PriceRule = {
            title: "Base",
            value_type: "percentage",
            target_type: "line_item",
            target_selection: "all",
            allocation_method: "across",
            value: "-10.0",
            customer_selection: "all",
            once_per_customer: false,
            prerequisite_subtotal_range: {
                greater_than_or_equal_to: 40.0
            },
            starts_at: new Date().toISOString()
        };

        return pr;
    }

    async function createPriceRule() {
        const pr = await prService.create(mockPriceRule());
        prToBeDeleted.push(pr);
        return pr;
    }

    function mockPriceRuleDiscountCode(code: string = "unit") {
        const dc: PriceRuleDiscountCode = {
            code
        };

        return dc;
    }

    async function createPriceRuleDiscountCode(pr: PriceRule, code?: string) {
        const service = new PriceRuleDiscounts(config.shopDomain, config.accessToken, pr.id);
        const dc = await service.create(mockPriceRuleDiscountCode(code));

        // Track discount codes, relative to their owner (price rule)
        if (dcToBeDeleted[pr.id]) {
            dcToBeDeleted[pr.id].push(dc)
        } else {
            dcToBeDeleted[pr.id] = [dc]
        }
        return dc;
    }

    after(async () => {

        const count = prToBeDeleted.length;

        for (let pr of prToBeDeleted) {

            // Delete children discounts
            const dcService = new PriceRuleDiscounts(config.shopDomain, config.accessToken, pr.id);

            if (dcToBeDeleted[pr.id]) {
                for (let dc of dcToBeDeleted[pr.id]) {
                    console.log(`Delete dc ${dc.code}`)
                    await dcService.delete(dc.id)
                }
            }

            // Finally, delete parent  
            await prService.delete(pr.id)
        }

        console.log(`Deleted ${count} PriceRules.`);
    })

    it("should create a price rule", async () => {

        const pr = await createPriceRule();
        expect(pr).to.be.an("object");
        expect(pr.title).to.be.a("string");
        expect(pr.id).to.be.a("number").and.to.be.gte(1);

        const dc = await createPriceRuleDiscountCode(pr)
        expect(dc).to.be.an("object");
        expect(dc.code).to.be.a("string");
        expect(dc.id).to.be.a("number").and.to.be.gte(1);

        // Throws a 'exceeded max number of discount codes permitted' error for now until shopify change their limits
        try {
            const dc2 = await createPriceRuleDiscountCode(pr, "unit2")
            expect(dc2).to.be.an("object");
            expect(dc2.code).to.be.a("string");
            expect(dc2.id).to.be.a("number").and.to.be.gte(1);
        } catch (err) {
            console.log(err)
        }

    });

    it("should get a price rule", async () => {
        const id = (await createPriceRule()).id;
        const pr = await prService.get(id);

        expect(pr).to.be.an("object");
        expect(pr.title).to.be.a("string");
        expect(pr.id).to.be.a("number").and.to.be.gte(1);
    });

    it("should get a price rule (rate limit test", async () => {

        const id = (await createPriceRule()).id;

        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push(prService.get(id));
        }

        console.time('rateTest');
        await Promise.all(arr)
        console.timeEnd('rateTest'); // Expect ~60 seconds
    });

    it("should list PriceRules", async () => {
        await createPriceRule();

        const list = await prService.list();

        expect(Array.isArray(list)).to.be.true;
        list.forEach(pr => {
            expect(pr).to.be.an("object");
            expect(pr.id).to.be.gte(1);
            expect(pr.title).to.be.a("string");
        })
    });

    it("should update a price rule", async () => {
        const pr = await createPriceRule();
        pr.value = "-5.0";

        const updated = await prService.update(pr.id, pr);
        expect(updated).to.be.an("object");
        expect(updated.id).to.be.gte(1);
        expect(updated.value).to.equal(pr.value);
    })

    it("should update a price rule discount code", async () => {

        try {
            const pr = await createPriceRule();

            // Create discount code 
            const dc = await createPriceRuleDiscountCode(pr, "before")
            expect(dc).to.be.an("object");
            expect(dc.code).to.be.a("string");
            expect(dc.id).to.be.a("number").and.to.be.gte(1);
            console.log(1)
            // Update discount code 
            let updatedCode = "after"
            let dcService = new PriceRuleDiscounts(config.shopDomain, config.accessToken, pr.id);
            let updated = await dcService.update(dc.id, { code: updatedCode })
            expect(updated).to.be.an("object");
            expect(updated.code).to.be.a("string").and.to.be.eq(updatedCode);
        } catch (err) {
            console.error(err)
            throw err
        }
    })
});