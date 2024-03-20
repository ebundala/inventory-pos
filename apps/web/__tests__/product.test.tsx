import { createTenant } from "@/core/tenant";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Products operations",()=>{
    let tenantId:string | null;
    let productId:number=-1;
    let categoryId:number = -1;
    let brandId:number = -1;
    let unitId:number = -1;
    let userId:string;
    const subdomain="Products"
    const tenantName="tenantProducts"
    const testEmail = "Product@example.com";
    const productName = "TestProduct";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        //create test user
        const user = await prisma!.user.create({
            data:{
                name:productName,
                email:testEmail,
            }
        })
        userId=user.id;
        //create test tenant
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        router =appRouter.createCaller({session:null,tenantId});
        //create test category
        const category = await router.product.category.create({name:tenantName,code:"123",tenantId});
        categoryId = category?.id??null;
        //create test brand
        const brand = await router.product.brand.create({name:tenantName,tenantId});
        brandId = brand?.id??null;
         //create test unit
         const unit = await router.product.unit.create({name:"pieces",shortName:"pc",tenantId});
         unitId = unit?.id??null;
    });

    // beforeEach(async()=>{     
    // await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async()=>{
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
        //delete user
        await prisma!.user.delete({where:{id:userId}})
        //delete product
        await prisma!.product.delete({where:{id:productId}})
    
        //delete category
        await prisma!.category.delete({where:{id:categoryId}})
        //delete brand
        await prisma!.brand.delete({where:{id:brandId}})
        //delete unit
        await prisma!.unit.delete({where:{id:unitId}})
        //delete tenant
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })

       
    });
    test("create new Product",async()=>{
       const product= await  router.product.create({
           name: productName,
           note: "good description",
           typeBarcode: "EAN-13",
           code: "xvx",
           categoryId: categoryId,
           brandId: brandId,
           unitId: unitId,
           stockAlert: 1,
           unitSaleId: unitId,
           tenantId: tenantId!,
           cost: 5000,
           price: 0,
           isVariant: true,
           isImei: false,
           productVariants:[{name:"green",qty:10,},{name:"yellow",}]
       });
        expect(product.name).toBe(productName)
        expect(product.cost).toBe(5000);       
        expect(product.category.id).toBe(categoryId)
        expect(product.brand?.id).toBe(brandId)
        expect(product.productUnit?.id).toBe(unitId)
        expect(product.productVariants.length).toBe(2)
        productId=product.id;

    });
    test("update Product",async()=>{
        const product = await router.product.update({
            id: productId,
            code: "test",           
            typeBarcode: "ean13",           
            isVariant: false,
            isImei: true,
            productVariants:[{name:"blue"},
            {name:"green"},{name:"indigo"}],
            tenantId: tenantId!
        });
        expect(product.code).toBe("test")
        expect(product.cost).toBe(5000);       
        expect(product.category.id).toBe(categoryId)
        expect(product.brand?.id).toBe(brandId)
        expect(product.productUnit?.id).toBe(unitId)
        expect(product.productVariants.length).toBe(3)
    });
    test("get unique Product",async ()=>{
        const product = await router.product.get(productId);
        expect(product?.id).toBe(productId)
        expect(product?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Product",async ()=>{
        const product = await router.product.search({
            where:{name:{equals:productName}}
        });
        expect(product.length).toBeGreaterThan(0)
        expect(product[0].name).toBe(productName)
    })
    test("delete Product ",async ()=>{
        const product = await router.product.delete(productId);
        expect(product?.id).toBe(productId)
        expect(product.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Product ",async ()=>{
        const product = await router.product.deleteMany([productId]);
        expect(product).toStrictEqual({count:1})
    })
    
})

