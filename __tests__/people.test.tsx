import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createCustomer, deleteManyCustomer, deleteCustomer, findManyCustomer, getUniqueCustomer, updateCustomer } from "@/core/customer";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { createCustomerInputSchema, updateCustomerInputSchema } from "@/core/customer/index.zod";

describe("Customers operations", () => {
    let tenantId: string | null;
    let customerId: number = 0;
    let userId: string;
    const subdomain = "customers"
    const tenantName = "tenantCustomers"
    const testEmail = "email3@example.com";
    const customerName = "Tesla";
    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: customerName,
                email: testEmail,
            }
        })
        userId = user.id;
        const tenant = await createTenant({ subdomain, name: tenantName, userId: userId });
        tenantId = tenant?.tenantId ?? null;

        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
    });

    beforeEach(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async () => {
        await prisma!.user.delete({ where: { id: userId } })
        await prisma!.tenant.deleteMany({
            where: {
                subdomain: { equals: subdomain }
            }
        })
    });
    test("create new Customer", async () => {
        const input = createCustomerInputSchema.parse({
            name: customerName,
            code: 123,
            email: "email@test.com",
            country: "tanzania",
            city: "dar es salaam",
            phone: "123456",
            address: "kibaha",
            tenantId: tenantId
        })
        const customer = await createCustomer(input);
        expect(customer.name).toBe(input.name)
        expect(customer.email).toBe(input.email);
        expect(customer.address).toBe(input.address);
        expect(customer.id).not.toBe(0)
        customerId = customer.id;

    });
    test("update Customer", async () => {
        const input = updateCustomerInputSchema.parse({
            id: customerId,           
            code: 124,
            email: "email@test.com",
            country: "tanzania",
            city: "dar es salaam2",
            phone: "123456",
            address: "test",

        })
        const customer = await updateCustomer(input);
        expect(customer.city).toBe(input.city)
        expect(customer.code).toBe(input.code)
        expect(customer.email).toBe(input.email);
        expect(customer.address).toBe(input.address);
        expect(customer.id).toBe(customerId)
    });
    test("get unique Customer", async () => {
        const customer = await getUniqueCustomer(customerId);
        expect(customer?.id).toBe(customerId)
        expect(customer?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Customer", async () => {
        const customer = await findManyCustomer({
            search: customerName.substring(2, 4)
        });
        expect(customer.length).toBeGreaterThan(0)
        expect(customer[0].name).toBe(customerName)
    })
    test("delete Customer ", async () => {
        const Customer = await deleteCustomer(customerId);
        expect(Customer?.id).toBe(customerId)
        expect(Customer.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Customer ", async () => {
        const Customer = await deleteManyCustomer([customerId]);
        expect(Customer).toStrictEqual({ count: 1 })
    })

})

