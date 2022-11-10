import { createTenant } from "@/core/tenant";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Settings operations", () => {
    let tenantId: string | null;
    let settingId: number = 0;
    let userId: string;
    let warehouseId: number = -1;
    let currencyId: number = -1;
    let customerId: number = -1;
    const subdomain = "settings"
    const tenantName = "tenantSettings"
    const testEmail = "email3@example.com";
    const settingName = "Tesla";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: settingName,
                email: testEmail,
            }
        })
        userId = user.id;
        const tenant = await createTenant({ subdomain, name: tenantName, userId: userId });
        tenantId = tenant?.tenantId ?? null;
        router =appRouter.createCaller({session:null,tenantId});

   
        const warehouse = await router.setting.warehouse.create({
            name: "warehouseName",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId = warehouse.id ?? null;

        //create customer
        const customer = await router.people.create({
            tenantId: tenantId,
            email: "quote@customer.com",
            name: "wark in customer",
            code: 34,
            country: "tanzania",
            city: "kibaha",
            phone: "071422",
            address: "kitende"
        })
        customerId = customer.id ?? null;
        //create currency
        const currency = await router.setting.currency.create({
            tenantId: tenantId,
            name: "Tanzanian shilling",
            code: "1",
            symbol: "TZS"
        })
        currencyId = currency.id ?? null;
    });

    // beforeEach(async () => {
    //     await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)

        await prisma!.setting.delete({ where: { id: settingId } }).catch((e)=>{})

        await prisma!.customer.delete({ where: { id: customerId } }).catch((e)=>{})
        await prisma!.warehouse.delete({ where: { id: warehouseId } }).catch((e)=>{})
        await prisma!.currency.delete({ where: { id: currencyId } }).catch((e)=>{})

        await prisma!.user.delete({ where: { id: userId } }).catch((e)=>{})
        await prisma!.tenant.deleteMany({
            where: {
                subdomain: { equals: subdomain }
            }
        }).catch((e)=>{})
    });
    test("create new Setting", async () => {
        const input = {
            email: testEmail,
            currencyId: currencyId,
            companyName: settingName,
            companyPhone: "1234",
            companyAddress: "kibaha",
            logo: "nnnn",
            footer: "hello world",
            developedBy: "hello world",
            customerId: customerId,
            warehouseId: warehouseId,
            defaultLanguage: "en",
            tenantId: tenantId!
        }
        const setting = await router.setting.create(input);
        expect(setting.email).toBe(input.email)
        expect(setting.customerId).toBe(input.customerId);
        expect(setting.defaultLanguage).toBe(input.defaultLanguage);
        expect(setting.id).not.toBe(0)
        settingId = setting.id;

    });
    test("update Setting", async () => {
        const input = {
            id: settingId,
            email: testEmail,          
            companyName: settingName,
            companyPhone: "1234",
            companyAddress: "kibaha",
            logo: "test",
            footer: "hello world",
            developedBy: "hello world2",            
            defaultLanguage: "sw",
        }

        const setting = await router.setting.update(input);
        expect(setting.developedBy).toBe(input.developedBy)
        expect(setting.customerId).toBe(customerId);
        expect(setting.defaultLanguage).toBe(input.defaultLanguage);
        
        expect(setting.id).toBe(settingId)
    });

    test("get unique Setting", async () => {
        const setting = await router.setting.get(settingId);
        expect(setting?.id).toBe(settingId)
        expect(setting?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Setting", async () => {
        const setting = await router.setting.search({
            where:{companyName:{equals:settingName}}
        });
        expect(setting.length).toBeGreaterThan(0)
        expect(setting[0].companyName).toBe(settingName)
    })
    test("delete Setting ", async () => {
        const Setting = await router.setting.delete(settingId);
        expect(Setting?.id).toBe(settingId)
        expect(Setting.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Setting ", async () => {
        const Setting = await router.setting.deleteMany([settingId]);
        expect(Setting).toStrictEqual({ count: 1 })
    })

})

