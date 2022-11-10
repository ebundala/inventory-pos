import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createProduct ,deleteManyProduct,deleteProduct,findManyProduct,
    getUniqueProduct,updateProduct} from "@/core/product";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { createCategory } from "@/core/category";
import { createBrand } from "@/core/brand";
import { createUnit } from "@/core/unit";

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
        //create test category
        const category = await createCategory({name:tenantName,code:"123",tenantId});
        categoryId = category?.id??null;
        //create test brand
        const brand = await createBrand({name:tenantName,tenantId});
        brandId = brand?.id??null;
         //create test unit
         const unit = await createUnit({name:"pieces",shortName:"pc",tenantId});
         unitId = unit?.id??null;
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
    });

    beforeEach(async()=>{     
    await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async()=>{
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
       const product= await  createProduct({
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
        const product = await updateProduct({
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
        const product = await getUniqueProduct(productId);
        expect(product?.id).toBe(productId)
        expect(product?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Product",async ()=>{
        const product = await findManyProduct({
            where:{name:{equals:productName}}
        });
        expect(product.length).toBeGreaterThan(0)
        expect(product[0].name).toBe(productName)
    })
    test("delete Product ",async ()=>{
        const product = await deleteProduct(productId);
        expect(product?.id).toBe(productId)
        expect(product.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Product ",async ()=>{
        const product = await deleteManyProduct([productId]);
        expect(product).toStrictEqual({count:1})
    })
    
})

