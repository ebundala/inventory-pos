import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createUnit ,deleteManyUnit,deleteUnit,findManyUnit,getUniqueUnit,updateUnit} from "@/core/unit";
import {prisma} from "@/core"
import { Prisma,RecordStatus } from "@prisma/client";

describe("Units operations",()=>{
    let tenantId:string|null;
    let unitId:number=0;
    let userId:string;
    const subdomain="pos2"
    const tenantName="tenantunit"
    const testEmail = "email2@example.com";
    const unitName = "kilogram";
    const ShortName= "kg";
    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:unitName,
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
    test("create new Unit",async()=>{
       const unit= await  createUnit({
        name:"kilogram",shortName:"kg",tenantId:tenantId!
       });
        expect(unit.shortName).toBe(ShortName)
        expect(unit.name).toBe(unitName);       
        expect(unit.id).not.toBe(0)
        unitId=unit.id;

    });
    test("update Unit",async()=>{
        const unit2 = await updateUnit({
            id:unitId,
            operator:"+",
            operatorValue:5
        });
        expect(unit2.operator?.trim()).toBe("+")
        expect(unit2.operatorValue).toBe(5)

    });
    test("get unique Unit",async ()=>{
        const unit = await getUniqueUnit(unitId);
        expect(unit?.id).toBe(unitId)
        expect(unit?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Unit",async ()=>{
        const units = await findManyUnit({
            where:{shortName:{equals:ShortName}}
        });
        expect(units.length).toBeGreaterThan(0)
        expect(units[0].shortName).toBe(ShortName)
    })
    test("delete Unit ",async ()=>{
        const unit = await deleteUnit(unitId);
        expect(unit?.id).toBe(unitId)
        expect(unit.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Unit ",async ()=>{
        const unit = await deleteManyUnit([unitId]);
        expect(unit).toStrictEqual({count:1})
    })
    
})

