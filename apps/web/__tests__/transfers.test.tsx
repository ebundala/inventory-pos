import { createTenant } from "@/core/tenant";
import { prisma } from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Transfers operations", () => {
    let tenantId: string | null;
    let transferId: number = 0;
    let productId: number = -1;
    let categoryId: number = -1;
    let brandId: number = -1;
    let unitId: number = -1;
    let warehouseId: number = -1;
    let warehouseId2: number = -1;
    let productVariantId: number = -1
    let transferDetailId: number = -1;
    let userId: string;

    const subdomain = "Transfers"
    const tenantName = "tenantTransfers"
    const testEmail = "transfer@example.com";
    const transferName = "Tesla";
    const productName = "TestProduct";
    let router: ReturnType<typeof appRouter.createCaller>


    beforeAll(async () => {
        const user = await prisma!.user.create({
            data: {
                name: transferName,
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
            unitPurchaseId: unitId,
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
        const warehouse = await router.setting.warehouse.create({
            name: "warehouseName1",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId = warehouse.id ?? null;

        const warehouse2 = await router.setting.warehouse.create({
            name: "warehouseName1",
            city: testEmail,
            mobile: "tests",
            tenantId: tenantId!
        });
        warehouseId2 = warehouse2.id ?? null;
    });

    // beforeEach(async () => {
    //     await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async () => {
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)

        //delete transfer
        await prisma!.transfer.delete({ where: { id: transferId } })

        //delete product
        await prisma!.product.delete({ where: { id: productId } })
        
        
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

    test("create new Transfer", async () => {
        const input = {
            userId: userId,
            ref: "nnnn",
            date: new Date(),
            fromWarehouseId: warehouseId,
            toWarehouseId: warehouseId2,
            items: 4,
            taxRate: 5,
            taxNet: 50,
            discount: 500,
            shipping: 500,
            grandTotal: 3000,
            status: "complete",
            notes: "hello world",
            transferDetails: [
                {
                    productId: productId,
                    productVariantId: productVariantId,
                    cost: 4000,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "inclusive",
                    discount: 500,
                    discountMethod: "cash",
                    quantity: 4,
                    total: 3000
                }
            ],
            tenantId: tenantId!
        }

        const transfer = await router.transfer.create(input);
        expect(transfer.grandTotal).toBe(input.grandTotal)
        expect(transfer.notes).toBe(input.notes);
        expect(transfer.tenantId).toBe(tenantId)
        expect(transfer.transferDetails[0].cost).toBe(input.transferDetails![0].cost)
        expect(transfer.transferDetails[0].quantity).toBe(input.transferDetails![0].quantity)

        transferId = transfer.id;
        transferDetailId = transfer.transferDetails[0].id;
    });

    test("update Transfer", async () => {
        const input = {
            id: transferId,
            tenantId: tenantId!,
            userId: userId,
            ref: "test",
            date: new Date(),
            fromWarehouseId: warehouseId,
            toWarehouseId: warehouseId2,
            items: 4,
            taxRate: 5,
            taxNet: 50,
            discount: 500,
            shipping: 500,
            grandTotal: 3000,
            status: "complete",
            notes: "hello world",
            transferDetails: [
                {
                    id: transferDetailId,
                    productId: productId,
                    productVariantId: productVariantId,
                    cost: 3000,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "inclusive",
                    discount: 500,
                    discountMethod: "cash",
                    quantity: 6,
                    total: 3000
                },
                {

                    productId: productId,
                    productVariantId: productVariantId,
                    cost: 5000,
                    purchaseUnitId: unitId,
                    taxNet: 5,
                    taxMethod: "inclusive",
                    discount: 500,
                    discountMethod: "cash",
                    quantity: 12,
                    total: 3000
                }
            ],

        }
        const transfer2 = await router.transfer.update(input);
        expect(transfer2.ref?.trim()).toBe("test")
        expect(transfer2.transferDetails.find((v) => v.id === transferDetailId)?.quantity).toBe(input.transferDetails![0].quantity)
        expect(transfer2.transferDetails.find((v) => v.id !== transferDetailId)?.quantity).toBe(input.transferDetails![1].quantity)
        expect(transfer2.transferDetails.length).toBe(2)



    });
    test("get unique Transfer", async () => {
        const Transfer = await router.transfer.get(transferId);
        expect(Transfer?.id).toBe(transferId)
        expect(Transfer?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Transfer", async () => {
        const transfer = await router.transfer.search({
            where:{ref:{equals:"test"}}
        });
        expect(transfer.length).toBeGreaterThan(0)
        expect(transfer[0].ref).toBe("test")
    })
    test("delete Transfer ", async () => {
        const transfer = await router.transfer.delete(transferId);
        expect(transfer?.id).toBe(transferId)
        expect(transfer.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Transfer ", async () => {
        const Transfer = await router.transfer.deleteMany([transferId]);
        expect(Transfer).toStrictEqual({ count: 1 })
    })

})

