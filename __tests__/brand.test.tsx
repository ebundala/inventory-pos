import { createTenant,} from "@/core/tenant";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Brands operations",()=>{
    let tenantId:string|null;
    let brandId:number=0;
    let userId:string;
    const subdomain="brands"
    const tenantName="tenantBrands"
    const testEmail = "email3@example.com";
    const brandName = "Tesla";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:brandName,
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
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Brand",async()=>{
       const brand= await  router.product.brand.create({
        name:brandName,tenantId:tenantId!
       });
        expect(brand.name).toBe(brandName)
        expect(brand.name).toBe(brandName);       
        expect(brand.id).not.toBe(0)
        brandId=brand.id;

    });
    test("update Brand",async()=>{
        const brand2 = await router.product.brand.update({
            id:brandId,
           description:"test",
           
        });
        expect(brand2.description?.trim()).toBe("test")
    });
    test("get unique Brand",async ()=>{
        const brand = await router.product.brand.get(brandId);
        expect(brand?.id).toBe(brandId)
        expect(brand?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Brand",async ()=>{
        const brand = await router.product.brand.search({
            where:{name: {equals:brandName}}
        });
        expect(brand.length).toBeGreaterThan(0)
        expect(brand[0].name).toBe(brandName)
    })
    test("delete Brand ",async ()=>{
        const Brand = await router.product.brand.delete(brandId);
        expect(Brand?.id).toBe(brandId)
        expect(Brand.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Brand ",async ()=>{
        const Brand = await router.product.brand.deleteMany([brandId]);
        expect(Brand).toStrictEqual({count:1})
    })
    
})

