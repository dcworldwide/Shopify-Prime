import { expect } from "chai"
import { Models, Orders } from "shopify-prime"
import * as config from "./_utils"
import Order = Models.Order

describe("Orders", function () {
    this.timeout(30000)

    const service = new Orders(config.shopDomain, config.accessToken)
    const toBeDeleted: Order[] = []

    function mockOrder() {
        const order: Order = {
            billing_address: {
                address1: "123 4th Street",
                city: "Minneapolis",
                province: "Minnesota",
                province_code: "MN",
                zip: "55401",
                phone: "555-555-5555",
                first_name: "John",
                last_name: "Doe",
                company: "Tomorrow Corporation",
                country: "United States",
                country_code: "US",
                default: true,
            },
            line_items: [
                {
                    name: "Test Line Item",
                    title: "Test Line Item Title",
                    quantity: 2,
                    price: 5
                },
                {
                    name: "Test Line Item 2",
                    title: "Test Line Item Title 2",
                    quantity: 2,
                    price: 5
                }
            ],
            financial_status: "paid",
            total_price: 5.00,
            email: Math.floor(Math.random()) + "@example.com",
            note: "Test note about the customer.",
        }

        return order
    }

    async function createOrder() {
        const order = await service.create(mockOrder(), undefined, { send_receipt: false, send_fulfillment_receipt: false })
        toBeDeleted.push(order)
        return order
    }

    after(async () => {
        const count = toBeDeleted.length
        for (let order of toBeDeleted) {
            await service.delete(order.id)
        }
        console.log(`Deleted ${count} orders.`)
    })

    it("should create an order", async () => {
        const order = await createOrder()
        expect(order).to.be.an("object")
        expect(order.contact_email).to.be.a("string")
        expect(order.id).to.be.a("number").and.to.be.gte(1)
    })

    it("should count orders", async () => {
        const count = await service.count()
        expect(count).to.be.gte(1)
    })

    it("should get an order", async () => {
        const id = toBeDeleted[0].id
        const order = await service.get(id)
        expect(order).to.be.an("object")
        expect(order.contact_email).to.be.a("string")
        expect(order.id).to.be.a("number").and.to.be.gte(1)
    })

    it("should get an order with only one field", async () => {
        const id = toBeDeleted[0].id
        const order = await service.get(id, { fields: "id" })
        expect(order).to.be.an("object")
        expect(order.id).to.be.gte(1)
        expect(Object.getOwnPropertyNames(order).every(key => key === "id")).to.be.true
    })

    it("should list orders", async () => {
        const list = await service.list()
        expect(Array.isArray(list)).to.be.true
        list.forEach(order => {
            expect(order).to.be.an("object")
            expect(order.id).to.be.gte(1)
            expect(order.contact_email).to.be.a("string")
        })
    })

    it("should update an order", async () => {
        const id = toBeDeleted[0].id
        const note = "Updated note"
        const order = await service.update(id, { note })
        expect(order).to.be.an("object")
        expect(order.id).to.be.gte(1)
        expect(order.note).to.equal(note)
    })

    it("should close an order", async () => {
        const id = toBeDeleted[0].id
        const order = await service.close(id)
        expect(order).to.be.an("object")
        expect(order.closed_at).to.be.a("string").and.not.be.undefined.and.not.be.null
    })

    it("should open an order", async () => {
        const id = toBeDeleted[0].id
        await service.close(id)
        const order = await service.open(id)
        expect(order).to.be.an("object")
        expect(order.closed_at).to.satisfy((closed_at) => closed_at === null || closed_at === undefined)
    })

    it("should cancel an order", async () => {
        const id = toBeDeleted[0].id
        const order = await service.cancel(id)
        expect(order).to.be.an("object")
        expect(order.id).to.equal(id)
    })

    it("should cancel an order with options", async () => {
        let order = await createOrder()
        const id = order.id
        order = await service.cancel(id, { reason: "customer" })
        expect(order).to.be.an("object")
        expect(order.id).to.equal(id)
    })

    it("should delete an order", async () => {
        let error
        try {
            const order = await createOrder()
            await service.delete(order.id)
        } catch (e) {
            error = e
        }

        expect(error).to.be.undefined
    })
})