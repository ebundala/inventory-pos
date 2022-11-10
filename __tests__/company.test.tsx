import { createTenant } from "@/core/tenant";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Companys operations",()=>{
    let tenantId:string | null;
    let CompanyId:number=0;
    let userId:string;
    const subdomain="Companys"
    const tenantName="tenantCompanys"
    const testEmail = "Company@example.com";
    const companyName = "TestCompany";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:companyName,
                email:testEmail,
            }
        })
        userId=user.id;
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        router = appRouter.createCaller({session:null,tenantId});
    });

    // beforeEach(async()=>{     
    // await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async()=>{
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)

        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Company",async()=>{
       const company= await  router.hrm.create({
        name:companyName,
       
       city:testEmail,
        phone:"tests",
        tenantId:tenantId!
       });
        expect(company.name).toBe(companyName)
        expect(company.city).toBe(testEmail);       
        expect(company.id).not.toBe(0)
        CompanyId=company.id;

    });
    test("update Company",async()=>{
        const company2 = await router.hrm.update({
            id:CompanyId,
           city:"test",
        });
        expect(company2.city?.trim()).toBe("test")
    });
    test("get unique Company",async ()=>{
        const company = await router.hrm.get(CompanyId);
        expect(company?.id).toBe(CompanyId)
        expect(company?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Company",async ()=>{
        const company = await router.hrm.search({
            where:{name:{equals:companyName}}
        });
        expect(company.length).toBeGreaterThan(0)
        expect(company[0].name).toBe(companyName)
    })
    test("delete Company ",async ()=>{
        const company = await router.hrm.delete(CompanyId);
        expect(company?.id).toBe(CompanyId)
        expect(company.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Company ",async ()=>{
        const company = await router.hrm.deleteMany([CompanyId]);
        expect(company).toStrictEqual({count:1})
    })
    
})

