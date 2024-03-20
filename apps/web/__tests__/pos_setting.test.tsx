import { createTenant } from "@/core/tenant";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("PosSettings operations", () => {
    let tenantId: string | null;
    let posSettingId: number = 0;
    let userId: string;
    
    const subdomain = "posSettings"
    const tenantName = "tenantPosSettings"
    const testEmail = "email3@example.com";
    const posSettingName = "Tesla";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: posSettingName,
                email: testEmail,
            }
        })
        userId = user.id;
        const tenant = await createTenant({ subdomain, name: tenantName, userId: userId });
        tenantId = tenant?.tenantId ?? null;
        router = appRouter.createCaller({session:null,tenantId});
   
        
    });

    // beforeEach(async () => {
    //     await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
        await prisma!.posSetting.delete({ where: { id: posSettingId } }).catch((e)=>{})
        await prisma!.user.delete({ where: { id: userId } }).catch((e)=>{})
        await prisma!.tenant.deleteMany({
            where: {
                subdomain: { equals: subdomain }
            }
        }).catch((e)=>{})
    });
    test("create new PosSetting", async () => {
        const input = {
            noteCustomer :"hello world",     
            showNote     :false,      
            showBarcode  :false,      
            showDiscount :false,     
            showCustomer :false,      
            showEmail    :false,      
            showPhone    :false,      
            showAddress  :false,
            tenantId: tenantId!
        }
        const posSetting = await router.setting.pos.create(input);
        expect(posSetting.noteCustomer).toBe(input.noteCustomer)
        expect(posSetting.showNote).toBe(input.showNote);
        expect(posSetting.showBarcode).toBe(input.showBarcode);
        expect(posSetting.id).not.toBe(0)
        posSettingId = posSetting.id;

    });
    test("update PosSetting", async () => {
        const input = {
            id: posSettingId,
            noteCustomer :"hello world2 test",     

            showNote     :true,      
            showBarcode  :true,      
            showDiscount :true,     
            showCustomer :true,      
            showEmail    :true,      
            showPhone    :true,      
            showAddress  :true,
        }

        const posSetting = await router.setting.pos.update(input);
        expect(posSetting.noteCustomer).toBe(input.noteCustomer)
        expect(posSetting.showNote).toBe(input.showNote);
        expect(posSetting.showBarcode).toBe(input.showBarcode); 
        expect(posSetting.id).toBe(posSettingId)
    });

    test("get unique PosSetting", async () => {
        const posSetting = await router.setting.pos.get(posSettingId);
        expect(posSetting?.id).toBe(posSettingId)
        expect(posSetting?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many PosSetting", async () => {
        const posSetting = await router.setting.pos.search({
            where:{noteCustomer:{equals:"hello world2 test"}}
        });
        expect(posSetting.length).toBeGreaterThan(0)
        expect(posSetting[0].noteCustomer).toBe("hello world2 test")
    })
    test("delete PosSetting ", async () => {
        const PosSetting = await router.setting.pos.delete(posSettingId);
        expect(PosSetting?.id).toBe(posSettingId)
        expect(PosSetting.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many PosSetting ", async () => {
        const PosSetting = await router.setting.pos.deleteMany([posSettingId]);
        expect(PosSetting).toStrictEqual({ count: 1 })
    })

})

