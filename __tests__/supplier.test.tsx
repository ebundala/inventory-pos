import { createTenant } from "@/core/tenant";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Suppliers operations",()=>{
    let tenantId:string | null;
    let supplierId:number=0;
    let userId:string;
    const subdomain="Suppliers"
    const tenantName="tenantSuppliers"
    const testEmail = "Supplier@example.com";
    const SupplierName = "TestSupplier";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:SupplierName,
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
    test("create new Supplier",async()=>{
       const Supplier= await  router.people.supplier.create({
        name:SupplierName,
        code:56,
        email:testEmail,
        phone:"tests",
        tenantId:tenantId!
       });
        expect(Supplier.name).toBe(SupplierName)
        expect(Supplier.email).toBe(testEmail);       
        expect(Supplier.id).not.toBe(0)
        supplierId=Supplier.id;

    });
    test("update Supplier",async()=>{
        const Supplier2 = await router.people.supplier.update({
            id:supplierId,
           city:"test",
        });
        expect(Supplier2.city?.trim()).toBe("test")
    });
    test("get unique Supplier",async ()=>{
        const supplier = await router.people.supplier.get(supplierId);
        expect(supplier?.id).toBe(supplierId)
        expect(supplier?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Supplier",async ()=>{
        const supplier = await router.people.supplier.search({
            where:{name:{equals:SupplierName}}
        });
        expect(supplier.length).toBeGreaterThan(0)
        expect(supplier[0].name).toBe(SupplierName)
    })
    test("delete Supplier ",async ()=>{
        const supplier = await router.people.supplier.delete(supplierId);
        expect(supplier?.id).toBe(supplierId)
        expect(supplier.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Supplier ",async ()=>{
        const supplier = await router.people.supplier.deleteMany([supplierId]);
        expect(supplier).toStrictEqual({count:1})
    })
    
})

