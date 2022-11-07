import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createCategory ,deleteManyCategory,deleteCategory,findManyCategory,getUniqueCategory,updateCategory} from "@/core/category";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";

describe("Categorys operations",()=>{
    let tenantId:string | null;
    let categoryId:number=0;
    let userId:string;
    const subdomain="Categorys"
    const tenantName="tenantCategorys"
    const testEmail = "Category@example.com";
    const categoryName = "TestCategory";
   
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
    test("create new Category",async()=>{
       const category= await  createCategory({
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
        const category2 = await updateCategory({
            id:categoryId,
           code:"test",
           
        });
        expect(category2.code?.trim()).toBe("test")
    });
    test("get unique Category",async ()=>{
        const category = await getUniqueCategory(categoryId);
        expect(category?.id).toBe(categoryId)
        expect(category?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Category",async ()=>{
        const category = await findManyCategory({
            search:categoryName.substring(2,4)
        });
        expect(category.length).toBeGreaterThan(0)
        expect(category[0].name).toBe(categoryName)
    })
    test("delete Category ",async ()=>{
        const category = await deleteCategory(categoryId);
        expect(category?.id).toBe(categoryId)
        expect(category.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Category ",async ()=>{
        const category = await deleteManyCategory([categoryId]);
        expect(category).toStrictEqual({count:1})
    })
    
})

