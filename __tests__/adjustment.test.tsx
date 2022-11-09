import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createAdjustment, deleteManyAdjustment, deleteAdjustment, findManyAdjustment, getUniqueAdjustment, updateAdjustment } from "@/core/adjustment";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { createAdjustmentInputSchema, updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { createProduct } from "@/core/product";
import { createCategory } from "@/core/category";
import { createBrand } from "@/core/brand";
import { createUnit } from "@/core/unit";
import { createWarehouse } from "@/core/warehouse";

describe("Adjustments operations", () => {
    let tenantId: string | null;
    let adjustmentId: number = 0;
    let productId: number = -1;
    let categoryId: number = -1;
    let brandId: number = -1;
    let unitId: number = -1;
    let warehouseId: number = -1;
    let productVariantId: number = -1
    let adjustmentDetailId:number = -1;
    let userId: string;
    const subdomain = "Adjustments"
    const tenantName = "tenantAdjustments"
    const testEmail = "adjustment@example.com";
    const adjustmentName = "Tesla";
    const ShortName = "kg";
    const productName = "TestProduct";


    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: adjustmentName,
                email: testEmail,
            }
        })
        userId = user.id;
        const tenant = await createTenant({ subdomain, name: tenantName, userId: userId });
        tenantId = tenant?.tenantId ?? null;

        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
        //create test category
        const category = await createCategory({ name: tenantName, code: "123", tenantId });
        categoryId = category?.id ?? null;
        //create test brand
        const brand = await createBrand({ name: tenantName, tenantId });
        brandId = brand?.id ?? null;
        //create test unit
        const unit = await createUnit({ name: "pieces", shortName: "pc", tenantId });
        unitId = unit?.id ?? null;
        // create test product
        const product = await createProduct({
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
            price: 5500,
            isVariant: true,
            isImei: false,
            productVariants: [
                {name: "green", qty: 10},
                { name: "yellow", qty: 10 }
            ]
        });
        productId = product.id??null;
        productVariantId = product.productVariants[0].id??null
        const warehouse= await  createWarehouse({
            name:"warehouseName",           
            city:testEmail,
            mobile:"tests",
            tenantId:tenantId!
           });
       warehouseId = warehouse.id??null;
    });

    beforeEach(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async () => {
        //delete product
        await prisma!.product.delete({ where: { id: productId } })

          //delete adjustment
         await prisma!.adjustment.delete({ where: { id: adjustmentId } })
         //delete user
         await prisma!.user.delete({ where: { id: userId } })
      
        //delete category
        await prisma!.category.delete({ where: { id: categoryId } })
        //delete brand
        await prisma!.brand.delete({ where: { id: brandId } })
        //delete unit
        await prisma!.unit.delete({ where: { id: unitId } })
        //delete tenant
        await prisma!.tenant.deleteMany({
            where: {
                subdomain: { equals: subdomain }
            }
        })
    });

    test("create new Adjustment", async () => {
        const input = createAdjustmentInputSchema.parse({
            items: 5,
            notes: "hellow world",
            tenantId: tenantId,
            date: new Date(),          
            userId: userId,
            ref:"xxx",
            warehouseId: warehouseId,
            adjustmentDetails: [{
                    productVariantId:productVariantId,
                    productId:productId,
                    quantity:4,
                    type:"subtraction",
                } ]  
        })
        
        const adjustment = await createAdjustment(input);
        expect(adjustment.items).toBe(5)
        expect(adjustment.notes).toBe(input.notes);
        expect(adjustment.tenantId).toBe(tenantId)
        adjustmentId = adjustment.id;
        adjustmentDetailId = adjustment.adjustmentDetails[0].id;
    });

    test("update Adjustment", async () => {
        const input = updateAdjustmentInputSchema.parse({
            id: adjustmentId,
            ref: "test",
            tenantId:tenantId,
            adjustmentDetails:[
                {
                    id:adjustmentDetailId,
                    quantity:15
                }
            ]
        })
        const adjustment2 = await updateAdjustment(input);
        expect(adjustment2.ref?.trim()).toBe("test")
        expect(adjustment2.adjustmentDetails[0].quantity).toBe(input.adjustmentDetails![0].quantity)

    });
    test("get unique Adjustment", async () => {
        const Adjustment = await getUniqueAdjustment(adjustmentId);
        expect(Adjustment?.id).toBe(adjustmentId)
        expect(Adjustment?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Adjustment", async () => {
        const Adjustment = await findManyAdjustment({
            search: "test".substring(2, 3)
        });
        expect(Adjustment.length).toBeGreaterThan(0)
        expect(Adjustment[0].ref).toBe("test")
    })
    test("delete Adjustment ", async () => {
        const Adjustment = await deleteAdjustment(adjustmentId);
        expect(Adjustment?.id).toBe(adjustmentId)
        expect(Adjustment.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Adjustment ", async () => {
        const Adjustment = await deleteManyAdjustment([adjustmentId]);
        expect(Adjustment).toStrictEqual({ count: 1 })
    })

})

