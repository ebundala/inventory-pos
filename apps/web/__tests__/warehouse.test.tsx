import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createWarehouse ,deleteManyWarehouse,deleteWarehouse,findManyWarehouse,getUniqueWarehouse,updateWarehouse} from "@/core/warehouse";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";
import { router } from "@/core/trpc";

describe("Warehouses operations",()=>{
    let tenantId:string | null;
    let WarehouseId:number=0;
    let userId:string;
    const subdomain="Warehouses"
    const tenantName="tenantWarehouses"
    const testEmail = "Warehouse@example.com";
    const warehouseName = "TestWarehouse";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:warehouseName,
                email:testEmail,
            }
        })
        userId=user.id;
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        router =appRouter.createCaller({session:null,tenantId});

    });

    // beforeEach(async()=>{     
    // await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async()=>{
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)

        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Warehouse",async()=>{
       const warehouse= await  router.setting.warehouse.create({
        name:warehouseName,
       
       city:testEmail,
        mobile:"tests",
        tenantId:tenantId!
       });
        expect(warehouse.name).toBe(warehouseName)
        expect(warehouse.city).toBe(testEmail);       
        expect(warehouse.id).not.toBe(0)
        WarehouseId=warehouse.id;

    });
    test("update Warehouse",async()=>{
        const warehouse2 = await  router.setting.warehouse.update({
            id:WarehouseId,
           city:"test",
        });
        expect(warehouse2.city?.trim()).toBe("test")
    });
    test("get unique Warehouse",async ()=>{
        const warehouse = await  router.setting.warehouse.get(WarehouseId);
        expect(warehouse?.id).toBe(WarehouseId)
        expect(warehouse?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Warehouse",async ()=>{
        const Warehouse = await findManyWarehouse({
            where:{name:{equals:warehouseName}}
        });

        expect(Warehouse.length).toBeGreaterThan(0)
        expect(Warehouse[0].name).toBe(warehouseName)
    })

    test("delete Warehouse ",async ()=>{
        const warehouse = await  router.setting.warehouse.delete(WarehouseId);
        expect(warehouse?.id).toBe(WarehouseId)
        expect(warehouse.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Warehouse ",async ()=>{
        const warehouse = await  router.setting.warehouse.deleteMany([WarehouseId]);
        expect(warehouse).toStrictEqual({count:1})
    })
    
})

