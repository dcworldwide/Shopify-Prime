import { expect } from "chai";
import { ApplicationCredits } from "shopify-prime-dc";
import * as config from "./_utils";

describe("Application Credits", function () {
    this.timeout(30000);

    it("should create an application credit, but cannot be tested with a private app.");

    it("should get an application credit, but cannot be tested with a private app.");

    it("should list application credits", async function () {
        const service = new ApplicationCredits(config.shopDomain, config.accessToken);
        const credits = await service.list();

        expect(Array.isArray(credits)).to.be.true;
    })
})