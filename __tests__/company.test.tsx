import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createCompany ,deleteManyCompany,deleteCompany,findManyCompany,getUniqueCompany,updateCompany} from "@/core/company";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";

describe("Companys operations",()=>{
    let tenantId:string | null;
    let CompanyId:number=0;
    let userId:string;
    const subdomain="Companys"
    const tenantName="tenantCompanys"
    const testEmail = "Company@example.com";
    const companyName = "TestCompany";
   
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
    test("create new Company",async()=>{
       const company= await  createCompany({
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
        const company2 = await updateCompany({
            id:CompanyId,
           city:"test",
        });
        expect(company2.city?.trim()).toBe("test")
    });
    test("get unique Company",async ()=>{
        const company = await getUniqueCompany(CompanyId);
        expect(company?.id).toBe(CompanyId)
        expect(company?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Company",async ()=>{
        const company = await findManyCompany({
            search:companyName.substring(2,4)
        });
        expect(company.length).toBeGreaterThan(0)
        expect(company[0].name).toBe(companyName)
    })
    test("delete Company ",async ()=>{
        const company = await deleteCompany(CompanyId);
        expect(company?.id).toBe(CompanyId)
        expect(company.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Company ",async ()=>{
        const company = await deleteManyCompany([CompanyId]);
        expect(company).toStrictEqual({count:1})
    })
    
})

