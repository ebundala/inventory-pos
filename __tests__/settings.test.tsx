import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createSetting, deleteManySetting, deleteSetting, findManySetting, getUniqueSetting, updateSetting } from "@/core/setting";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { createSettingInputSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { createCustomer } from "@/core/customer";
import { createWarehouse } from "@/core/warehouse";
import { createCurrency } from "@/core/currency";

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

        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
   
        const warehouse = await createWarehouse({
            name: "warehouseName",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId = warehouse.id ?? null;

        //create customer
        const customer = await createCustomer({
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
        const currency = await createCurrency({
            tenantId: tenantId,
            name: "Tanzanian shilling",
            code: "1",
            symbol: "TZS"
        })
        currencyId = currency.id ?? null;
    });

    beforeEach(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async () => {
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
        const input = createSettingInputSchema.parse({
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
            tenantId: tenantId
        })
        const setting = await createSetting(input);
        expect(setting.email).toBe(input.email)
        expect(setting.customerId).toBe(input.customerId);
        expect(setting.defaultLanguage).toBe(input.defaultLanguage);
        expect(setting.id).not.toBe(0)
        settingId = setting.id;

    });
    test("update Setting", async () => {
        const input = updateSettingInputSchema.parse({
            id: settingId,
            email: testEmail,          
            companyName: settingName,
            companyPhone: "1234",
            companyAddress: "kibaha",
            logo: "test",
            footer: "hello world",
            developedBy: "hello world2",            
            defaultLanguage: "sw",
        })

        const setting = await updateSetting(input);
        expect(setting.developedBy).toBe(input.developedBy)
        expect(setting.customerId).toBe(customerId);
        expect(setting.defaultLanguage).toBe(input.defaultLanguage);
        
        expect(setting.id).toBe(settingId)
    });

    test("get unique Setting", async () => {
        const setting = await getUniqueSetting(settingId);
        expect(setting?.id).toBe(settingId)
        expect(setting?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Setting", async () => {
        const setting = await findManySetting({
            search: settingName.substring(2, 4)
        });
        expect(setting.length).toBeGreaterThan(0)
        expect(setting[0].companyName).toBe(settingName)
    })
    test("delete Setting ", async () => {
        const Setting = await deleteSetting(settingId);
        expect(Setting?.id).toBe(settingId)
        expect(Setting.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Setting ", async () => {
        const Setting = await deleteManySetting([settingId]);
        expect(Setting).toStrictEqual({ count: 1 })
    })

})

