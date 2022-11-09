import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createSale, deleteManySale, deleteSale, findManySale, getUniqueSale, updateSale } from "@/core/sale";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { createSaleInputSchema, updateSaleInputSchema } from "@/core/sale/index.zod";
import { createProduct } from "@/core/product";
import { createCategory } from "@/core/category";
import { createBrand } from "@/core/brand";
import { createUnit } from "@/core/unit";
import { createWarehouse } from "@/core/warehouse";
import { createCustomer } from "@/core/customer";
import { z } from "zod";

describe("Sales operations", () => {
    let tenantId: string | null;
    let saleId: number = 0;
    let productId: number = -1;
    let categoryId: number = -1;
    let brandId: number = -1;
    let unitId: number = -1;
    let warehouseId: number = -1;
    let productVariantId: number = -1
    let saleDetailId: number = -1;
    let userId: string;
    let customerId: number = -1;
    let paymentSaleId: number = -1;
    let shipmentId: number = -1;
    const subdomain = "Sales"
    const tenantName = "tenantSales"
    const testEmail = "sale@example.com";
    const saleName = "Tesla";
    const productName = "TestProduct";


    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: saleName,
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
        //delete sale
        await prisma!.sale.delete({ where: { id: saleId } })

        //delete product
        await prisma!.product.delete({ where: { id: productId } })

        //delete customer
        await prisma!.customer.delete({ where: { id: customerId } })


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
        //delete user
        await prisma!.user.delete({ where: { id: userId } })

    });

    test("create new Sale", async () => {
        const input = createSaleInputSchema.parse({
            userId: userId,
            date: new Date(),
            ref: "bxvx",
            isPos: false,
            customerId: customerId,
            warehouseId: warehouseId,
            taxRate: 5,
            taxNet: 500,
            discount: 100,
            shipping: 500,
            grandTotal: 5000,
            paidAmount: 4000,
            paymentStatus: "complete",
            status: "pending",
            notes: "hello world",
            saleDetails: [
                {
                    date: new Date(),
                    //saleId: number
                    productId: productId,
                    productVariantId: productVariantId,
                    imeiNumber: "xxxxx",
                    price: 5000,
                    saleUnitId: unitId,
                    taxNet: 1000,
                    taxMethod: "vvv",
                    discount: 500,
                    discountMethod: "bbb",
                    total: 4500,
                    quantity: 3
                }
            ],
            paymentSales: [
                {
                    // userId: string
                    date: new Date(),
                    ref: "nnn",
                    // saleId: number
                    amount: 5000,
                    change: 500,
                    reglement: "setled",
                    notes: "hello world"
                }
            ],
            shipments: [
                {
                    // userId: string
                    date: new Date(),
                    ref: "mmm",
                    // saleId: number
                    deliveredTo: "john",
                    shippingAddress: "kibaha",
                    status: "completed",
                    shippingDetails: "details"
                }
            ],
            tenantId: tenantId
        })

        const sale = await createSale(input);
        expect(sale.grandTotal).toBe(input.grandTotal)
        expect(sale.notes).toBe(input.notes);
        expect(sale.tenantId).toBe(tenantId)
        expect(sale.saleDetails[0].price).toBe(input.saleDetails![0].price)
        expect(sale.paymentSales[0].amount).toBe(input.paymentSales![0].amount)
        expect(sale.shipments[0].ref).toBe(input.shipments![0].ref)

        saleId = sale.id;
        saleDetailId = sale.saleDetails[0].id;
        paymentSaleId = sale.paymentSales[0].id;
        shipmentId = sale.shipments[0].id;
    });

    test("update Sale", async () => {
        const input = updateSaleInputSchema.parse({
            id: saleId,
            tenantId: tenantId,
            userId: userId,
            date: new Date(),
            ref: "test",
            isPos: false,
            customerId: customerId,
            warehouseId: warehouseId,
            taxRate: 5,
            taxNet: 500,
            discount: 100,
            shipping: 500,
            grandTotal: 5000,
            paidAmount: 4000,
            paymentStatus: "complete",
            status: "pending",
            notes: "hello world",
            saleDetails: [
                {
                    id: saleDetailId,
                    date: new Date(),
                    productId: productId,
                    productVariantId: productVariantId,
                    imeiNumber: "xxxxx",
                    price: 5000,
                    saleUnitId: unitId,
                    taxNet: 1000,
                    taxMethod: "vvv",
                    discount: 500,
                    discountMethod: "bbb",
                    total: 4500,
                    quantity: 3
                },
                {
                    date: new Date(),
                    productId: productId,
                    productVariantId: productVariantId,
                    imeiNumber: "xxxxx",
                    price: 5000,
                    saleUnitId: unitId,
                    taxNet: 1000,
                    taxMethod: "vvv",
                    discount: 500,
                    discountMethod: "bbb",
                    total: 4500,
                    quantity: 31
                }
            ],
            paymentSales: [
                {
                    id: paymentSaleId,
                    date: new Date(),
                    ref: "nnn",
                    amount: 15000,
                    change: 500,
                    reglement: "setled",
                    notes: "hello world"
                },
                {

                    date: new Date(),
                    ref: "nnn",
                    amount: 1000,
                    change: 500,
                    reglement: "setled",
                    notes: "hello world"
                }
            ],
            shipments: [
                {
                    id: shipmentId, date: new Date(),
                    ref: "mmm",
                    saleId: saleId,
                    deliveredTo: "john",
                    shippingAddress: "kibaha kitende",
                    status: "completed",
                    shippingDetails: "details"
                },
                {
                    // userId: string
                    date: new Date(),
                    ref: "mmm",

                    deliveredTo: "john",
                    shippingAddress: "kibaha kitende2",
                    status: "completed",
                    shippingDetails: "details"
                }
            ]
        })
        const sale2 = await updateSale(input);
        expect(sale2.ref?.trim()).toBe("test")
        expect(sale2.saleDetails.find((v) => v.id === saleDetailId)?.quantity).toBe(input.saleDetails![0].quantity)
        expect(sale2.saleDetails.find((v) => v.id !== saleDetailId)?.quantity).toBe(input.saleDetails![1].quantity)
        expect(sale2.saleDetails.length).toBe(2)

        expect(sale2.paymentSales.find((v) => v.id === paymentSaleId)?.amount).toBe(input.paymentSales![0].amount)
        expect(sale2.paymentSales.find((v) => v.id !== paymentSaleId)?.amount).toBe(input.paymentSales![1].amount)
        expect(sale2.paymentSales.length).toBe(2)

        expect(sale2.shipments.find((v) => v.id === shipmentId)?.deliveredTo).toBe(input.shipments![0].deliveredTo)
        expect(sale2.shipments.find((v) => v.id !== shipmentId)?.deliveredTo).toBe(input.shipments![1].deliveredTo)
        expect(sale2.shipments.length).toBe(2)

    });
    test("get unique Sale", async () => {
        const Sale = await getUniqueSale(saleId);
        expect(Sale?.id).toBe(saleId)
        expect(Sale?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Sale", async () => {
        const Sale = await findManySale({
            search: "test".substring(2, 3)
        });
        expect(Sale.length).toBeGreaterThan(0)
        expect(Sale[0].ref).toBe("test")
    })
    test("delete Sale ", async () => {
        const Sale = await deleteSale(saleId);
        expect(Sale?.id).toBe(saleId)
        expect(Sale.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Sale ", async () => {
        const Sale = await deleteManySale([saleId]);
        expect(Sale).toStrictEqual({ count: 1 })
    })

})

