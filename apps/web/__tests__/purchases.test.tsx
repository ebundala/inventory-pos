import { createTenant } from "@/core/tenant";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Purchases operations", () => {
    let tenantId: string | null;
    let purchaseId: number = 0;
    let productId: number = -1;
    let categoryId: number = -1;
    let brandId: number = -1;
    let unitId: number = -1;
    let warehouseId: number = -1;
    let productVariantId: number = -1
    let productVariantId2: number = -1
    let purchaseDetailId: number = -1;
    let userId: string;
    let customerId: number = -1;
    let supplierId: number = -1;
    let purchasePaymentId:number=-1;
    const subdomain = "Purchases"
    const tenantName = "tenantPurchases"
    const testEmail = "purchase@example.com";
    const purchaseName = "Tesla";
    const productName = "TestProduct";
    let router: ReturnType<typeof appRouter.createCaller>


    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: purchaseName,
                email: testEmail,
            }
        })
        userId = user.id;
        const tenant = await createTenant({ subdomain, name: tenantName, userId: userId });
        tenantId = tenant?.tenantId ?? null;
        router =appRouter.createCaller({session:null,tenantId});

        //create test category
        const category = await router.product.category.create({ name: tenantName, code: "123", tenantId });
        categoryId = category?.id ?? null;
        //create test brand
        const brand = await router.product.brand.create({ name: tenantName, tenantId });
        brandId = brand?.id ?? null;
        //create test unit
        const unit = await router.product.unit.create({ name: "pieces", shortName: "pc", tenantId });
        unitId = unit?.id ?? null;
        // create test product
        const product = await router.product.create({
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
        productVariantId2 = product.productVariants[1].id ?? null

        //create warehouse
        const warehouse = await router.setting.warehouse.create({
            name: "warehouseName",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId = warehouse.id ?? null;

        //create customer
        const customer = await router.people.create({
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
        //create supplier
        const supplier = await router.people.supplier.create({
            name: "supplierx", email: "supplierx@example.com",
            code: 234,
            address: "kibaha tc",
            tenantId: tenantId
        })
        supplierId = supplier.id ?? null;
    });

    // beforeEach(async () => {
    //     await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)

        //delete purchase
        await prisma!.purchase.delete({ where: { id: purchaseId } }).catch((e)=>{})
        //delete customer
        await prisma!.customer.delete({ where: { id: customerId } }).catch((e)=>{})
        //delete supplier
        await prisma!.supplier.delete({ where: { id: supplierId } }).catch((e)=>{})
        //delete product
        await prisma!.product.delete({ where: { id: productId } }).catch((e)=>{})

        //delete user
        await prisma!.user.delete({ where: { id: userId } }).catch((e)=>{})

        //delete category
        await prisma!.category.delete({ where: { id: categoryId } }).catch((e)=>{})
        //delete brand
        await prisma!.brand.delete({ where: { id: brandId } }).catch((e)=>{})
        //delete unit
        await prisma!.unit.delete({ where: { id: unitId } }).catch((e)=>{})
        //delete tenant
        await prisma!.tenant.deleteMany({
            where: {
                subdomain: { equals: subdomain }
            }
        }).catch((e)=>{})
    });

    test("create new Purchase", async () => {
        
        const input = {
            userId: userId,
            ref: "xcvc",
            date: new Date(),
            tenantId:tenantId!,
            supplierId: supplierId,
            warehouseId: warehouseId,
            taxRate: 5,
            taxNet: 50,
            discount: 40,
            shipping: 30,
            grandTotal: 500,
            paidAmount: 400,
            status: "pending",
            paymentStatus: "partial",
            notes: "hello world",
            paymentPurchases: [
                {
                    date: new Date(),
                    ref: "vbn",
                    amount: 400,
                    change: 100,
                    reglement: "partial payment",
                    notes: "nice"
                }
            ],
            purchaseDetails: [
                {
                    cost: 500,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "method",
                    discount: 50,
                    discountMethod: "method2",
                    productId: productId,
                    productVariantId: productVariantId,
                    imeiNumber: "1234",
                    total: 1500,
                    quantity: 10,
                    
                }
            ],
        }

        const purchase = await router.purchase.create(input);
        expect(purchase.grandTotal).toBe(input.grandTotal)
        expect(purchase.notes).toBe(input.notes);
        expect(purchase.tenantId).toBe(tenantId)
        expect(purchase.purchaseDetails[0].cost).toBe(input.purchaseDetails[0].cost)
        expect(purchase.paymentPurchases[0].amount).toBe(input.paymentPurchases[0].amount)

        purchaseId = purchase.id;
        purchaseDetailId = purchase.purchaseDetails[0].id;
        purchasePaymentId = purchase.paymentPurchases[0].id;
    });

    test("update Purchase", async () => {
        const input = {
            id: purchaseId,
            taxRate: 15,
            taxNet: 150,
            discount: 40,
            shipping: 30,
            grandTotal: 500,
            paidAmount: 400,
            status: "completed",
            paymentStatus: "partial",
            notes: "hello world",
            tenantId: tenantId!,
            paymentPurchases: [
                {
                    id: purchasePaymentId,
                    userId: userId,
                    date: new Date(),
                    ref: "vbn",
                    amount: 400,
                    change: 100,
                    reglement: "partial payment",
                    notes: "nice"
                },
                {
                  
                    userId: userId,
                    date: new Date(),
                    ref: "vbn",
                    amount: 400,
                    change: 650,
                    reglement: "partial payment",
                    notes: "nice"
                }
            ],
            purchaseDetails: [
                {
                    id: purchaseDetailId,
                    cost: 500,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "method",
                    discount: 50,
                    discountMethod: "method2",
                    productId: productId,
                    productVariantId: productVariantId,
                    imeiNumber: "1234",
                    total: 1500,
                    quantity: 1500
                },
                {
                    cost: 5000,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "method",
                    discount: 50,
                    discountMethod: "method2",
                    productId: productId,
                    productVariantId: productVariantId2,
                    imeiNumber: "1234",
                    total: 1500,
                    quantity: 10,
                    
                }
            ],
        }
        const purchase2 = await  router.purchase.update(input);
        expect(purchase2.taxRate).toBe(input.taxRate)
        expect(purchase2.paymentPurchases.find((v)=>v.id===purchasePaymentId)?.change).toBe(input.paymentPurchases![0].change)
        expect(purchase2.purchaseDetails.find((v)=>v.id===purchaseDetailId)?.quantity).toBe(input.purchaseDetails![0].quantity)
        expect(purchase2.purchaseDetails.find((v)=>v.id===purchaseDetailId)?.productVariantId).toBe(input.purchaseDetails![0].productVariantId)
        expect(purchase2.purchaseDetails.find((v)=>v.id!==purchaseDetailId)?.productVariantId).toBe(input.purchaseDetails![1].productVariantId)
        expect(purchase2.purchaseDetails.find((v)=>v.id!==purchaseDetailId)?.cost).toBe(input.purchaseDetails![1].cost)

        expect(purchase2.paymentPurchases.length).toBe(2)

    });
    test("get unique Purchase", async () => {
        const Purchase = await  router.purchase.get(purchaseId);
        expect(Purchase?.id).toBe(purchaseId)
        expect(Purchase?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Purchase", async () => {
        const Purchase = await  router.purchase.search({
            where:{notes:{equals:"hello world"}}
        });
        expect(Purchase.length).toBeGreaterThan(0)
        expect(Purchase[0].notes).toBe("hello world")
    })
    test("delete Purchase ", async () => {
        const Purchase = await  router.purchase.delete(purchaseId);
        expect(Purchase?.id).toBe(purchaseId)
        expect(Purchase.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Purchase ", async () => {
        const Purchase = await  router.purchase.deleteMany([purchaseId]);
        expect(Purchase).toStrictEqual({ count: 1 })
    })

})

