import { expect } from "chai";
import { Countries, Models } from "shopify-prime-dc";
import * as config from "./_utils";
import Country = Models.Country

describe("Countries", function () {
    this.timeout(30000);

    const service = new Countries(config.shopDomain, config.accessToken);
    const toBeDeleted: Country[] = [];

    function mockCountry() {
        const country: Country = {
            "code": "FR"
        };

        return country;
    }

    async function createCountry() {
        const country = await service.create(mockCountry());
        toBeDeleted.push(country);
        return country;
    }

    afterEach((cb) => setTimeout(cb, 2000));

    after((cb) => {
        const count = toBeDeleted.length;

        toBeDeleted.forEach(async (country) => await service.delete(country.id));

        console.log(`Deleted ${count} countrys.`);

        // Wait 1 second to help empty the API rate limit bucket
        setTimeout(cb, 1000);
    })

    it("should delete an country", async () => {
        let error;

        try {
            const country = await createCountry();

            await service.delete(country.id);
        } catch (e) {
            error = e;
        }

        expect(error).to.be.undefined;
    });

    it("should create an country", async () => {
        const country = await createCountry();
        expect(country).to.be.an("object");
        expect(country.name).to.be.a("string");
        expect(country.id).to.be.a("number").and.to.be.gte(1);
    });

    it("should get an country", async () => {
        const id = (await createCountry()).id;
        const country = await service.get(id);
        expect(country).to.be.an("object"); ``
        expect(country.name).to.be.a("string");
        expect(country.id).to.be.a("number").and.to.be.gte(1);
    });

    it("should get an country with only one field", async () => {
        const id = (await createCountry()).id;
        const country = await service.get(id, { fields: "id" });
        expect(country).to.be.an("object");
        expect(country.id).to.be.gte(1);
        expect(Object.getOwnPropertyNames(country).every(key => key === "id")).to.be.true;
    });

    it("should count countrys", async () => {
        await createCountry();
        const count = await service.count();
        expect(count).to.be.gte(1);
    });

    it("should list countrys", async () => {
        await createCountry();
        const list = await service.list();
        expect(Array.isArray(list)).to.be.true;
        list.forEach(country => {
            expect(country).to.be.an("object");
            expect(country.id).to.be.gte(1);
            expect(country.name).to.be.a("string");
        })
    });

    it("should update an country", async () => {
        const id = (await createCountry()).id;
        const tax = 0.1;
        const country = await service.update(id, { tax });
        expect(country).to.be.an("object");
        expect(country.id).to.be.gte(1);
        expect(country.tax).to.equal(tax);
    })
});