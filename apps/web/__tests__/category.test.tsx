import { createTenant } from "@/core/tenant";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Categorys operations",()=>{
    let tenantId:string | null;
    let categoryId:number=0;
    let userId:string;
    const subdomain="Categorys"
    const tenantName="tenantCategorys"
    const testEmail = "Category@example.com";
    const categoryName = "TestCategory";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:categoryName,
                email:testEmail,
            }
        })
        userId=user.id;
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        router = appRouter.createCaller({tenantId,session:null})
    });

    // beforeEach(async()=>{     
    // await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async()=>{
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Category",async()=>{
       const category= await  router.product.category.create({
        name:categoryName,
        code:"xvx",
        tenantId:tenantId!
       });
        expect(category.name).toBe(categoryName)
        expect(category.name).toBe(categoryName);       
        expect(category.id).not.toBe(0)
        categoryId=category.id;

    });
    test("update Category",async()=>{
        const category2 = await router.product.category.update({
            id:categoryId,
           code:"test",
           
        });
        expect(category2.code?.trim()).toBe("test")
    });
    test("get unique Category",async ()=>{
        const category = await router.product.category.get(categoryId);
        expect(category?.id).toBe(categoryId)
        expect(category?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Category",async ()=>{
        const category = await router.product.category.search({
            where:{name:{equals:categoryName}}
        });
        expect(category.length).toBeGreaterThan(0)
        expect(category[0].name).toBe(categoryName)
    })
    test("delete Category ",async ()=>{
        const category = await router.product.category.delete(categoryId);
        expect(category?.id).toBe(categoryId)
        expect(category.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Category ",async ()=>{
        const category = await router.product.category.deleteMany([categoryId]);
        expect(category).toStrictEqual({count:1})
    })
    
})

