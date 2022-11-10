import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createQuotation, deleteManyQuotation, deleteQuotation, findManyQuotation, getUniqueQuotation, updateQuotation } from "@/core/quotation";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { createQuotationInputSchema, updateQuotationInputSchema } from "@/core/quotation/index.zod";
import { createProduct } from "@/core/product";
import { createCategory } from "@/core/category";
import { createBrand } from "@/core/brand";
import { createUnit } from "@/core/unit";
import { createWarehouse } from "@/core/warehouse";
import { createCustomer } from "@/core/customer";

describe("Quotations operations", () => {
    let tenantId: string | null;
    let quotationId: number = 0;
    let productId: number = -1;
    let categoryId: number = -1;
    let brandId: number = -1;
    let unitId: number = -1;
    let warehouseId: number = -1;
    let productVariantId: number = -1
    let quotationDetailId: number = -1;
    let userId: string;
    let customerId: number = -1;
    const subdomain = "Quotations"
    const tenantName = "tenantQuotations"
    const testEmail = "quotation@example.com";
    const quotationName = "Tesla";
    const productName = "TestProduct";


    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: quotationName,
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
                { name: "green", qty: 10 },
                { name: "yellow", qty: 10 }
            ]
        });
        productId = product.id ?? null;
        productVariantId = product.productVariants[0].id ?? null
        const warehouse = await createWarehouse({
            name: "warehouseName",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId = warehouse.id ?? null;

        //create customer
        const customer = await createCustomer({
            tenantId: tenantId,
            email: "quote@customer.com",
            name: "wark in customer",
            code: 34,
            country: "tanzania",
            city: "kibaha",
            phone: "071422",
            address: "kitende"
        })
        customerId = customer.id ?? null;
    });

    beforeEach(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async () => {
        //delete product
        await prisma!.product.delete({ where: { id: productId } })

        //delete quotation
        await prisma!.quotation.delete({ where: { id: quotationId } })
        //delete customer
        await prisma!.customer.delete({ where: { id: customerId } })

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

    test("create new Quotation", async () => {
        const input = createQuotationInputSchema.parse({
            status: "pending",
            items: 5,
            notes: "hellow world",
            tenantId: tenantId,
            date: new Date(),
            userId: userId,
            ref: "xxx",
            customerId: customerId,
            grandTotal: 5000,
            warehouseId: warehouseId,
            quotationDetails: [{
                price: 500,
                saleUnitId: unitId,
                quantity: 10,
                taxNet: 50,
                total: 5000,
                productId: productId,
                productVariantId: productVariantId
            }]
        })

        const quotation = await createQuotation(input);
        expect(quotation.grandTotal).toBe(5000)
        expect(quotation.notes).toBe(input.notes);
        expect(quotation.tenantId).toBe(tenantId)
        expect(quotation.quotationDetails[0].price).toBe(input.quotationDetails[0].price)
        quotationId = quotation.id;
        quotationDetailId = quotation.quotationDetails[0].id;
    });

    test("update Quotation", async () => {
        const input = updateQuotationInputSchema.parse({
            id: quotationId,
            ref: "test",
            tenantId: tenantId,
            quotationDetails: [
                {
                    id: quotationDetailId,
                    quantity: 15
                },
                {
                    price: 5000,
                    saleUnitId: unitId,
                    quantity: 500,
                    taxNet: 50,
                    total: 5000,
                    productId: productId,
                    productVariantId: productVariantId
                }
            ]
        })
        const quotation2 = await updateQuotation(input);
        expect(quotation2.ref?.trim()).toBe("test")
        expect(quotation2.quotationDetails.find((v) => v.id === quotationDetailId)?.quantity).toBe(input.quotationDetails![0].quantity)
        expect(quotation2.quotationDetails.find((v) => v.id !== quotationDetailId)?.quantity).toBe(input.quotationDetails![1].quantity)
        expect(quotation2.quotationDetails.length).toBe(2)

    });
    test("get unique Quotation", async () => {
        const Quotation = await getUniqueQuotation(quotationId);
        expect(Quotation?.id).toBe(quotationId)
        expect(Quotation?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Quotation", async () => {
        const Quotation = await findManyQuotation({
            where:{ref:{equals:"test"}}
        });
        expect(Quotation.length).toBeGreaterThan(0)
        expect(Quotation[0].ref).toBe("test")
    })
    test("delete Quotation ", async () => {
        const Quotation = await deleteQuotation(quotationId);
        expect(Quotation?.id).toBe(quotationId)
        expect(Quotation.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Quotation ", async () => {
        const Quotation = await deleteManyQuotation([quotationId]);
        expect(Quotation).toStrictEqual({ count: 1 })
    })

})

