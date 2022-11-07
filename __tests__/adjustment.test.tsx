import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createAdjustment ,deleteManyAdjustment,deleteAdjustment,findManyAdjustment,getUniqueAdjustment,updateAdjustment} from "@/core/adjustment";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";

describe("Adjustments operations",()=>{
    let tenantId:string|null;
    let AdjustmentId:number=0;
    let userId:string;
    const subdomain="Adjustments"
    const tenantName="tenantAdjustments"
    const testEmail = "email3@example.com";
    const AdjustmentName = "Tesla";
    const ShortName= "kg";
    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:AdjustmentName,
                email:testEmail,
            }
        })
        userId=user.id;
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
    });

    beforeEach(async()=>{     
    await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async()=>{
        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Adjustment",async()=>{
       const Adjustment= await  createAdjustment({
        name:AdjustmentName,tenantId:tenantId!
       });
        expect(Adjustment.name).toBe(AdjustmentName)
        expect(Adjustment.name).toBe(AdjustmentName);       
        expect(Adjustment.id).not.toBe(0)
        AdjustmentId=Adjustment.id;

    });
    test("update Adjustment",async()=>{
        const Adjustment2 = await updateAdjustment({
            id:AdjustmentId,
           description:"test",
           
        });
        expect(Adjustment2.description?.trim()).toBe("test")
    });
    test("get unique Adjustment",async ()=>{
        const Adjustment = await getUniqueAdjustment(AdjustmentId);
        expect(Adjustment?.id).toBe(AdjustmentId)
        expect(Adjustment?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Adjustment",async ()=>{
        const Adjustment = await findManyAdjustment({
            search:AdjustmentName.substring(2,4)
        });
        expect(Adjustment.length).toBeGreaterThan(0)
        expect(Adjustment[0].name).toBe(AdjustmentName)
    })
    test("delete Adjustment ",async ()=>{
        const Adjustment = await deleteAdjustment(AdjustmentId);
        expect(Adjustment?.id).toBe(AdjustmentId)
        expect(Adjustment.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Adjustment ",async ()=>{
        const Adjustment = await deleteManyAdjustment([AdjustmentId]);
        expect(Adjustment).toStrictEqual({count:1})
    })
    
})

