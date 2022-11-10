import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createSupplier ,deleteManySupplier,deleteSupplier,findManySupplier,getUniqueSupplier,updateSupplier} from "@/core/supplier";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";

describe("Suppliers operations",()=>{
    let tenantId:string | null;
    let supplierId:number=0;
    let userId:string;
    const subdomain="Suppliers"
    const tenantName="tenantSuppliers"
    const testEmail = "Supplier@example.com";
    const SupplierName = "TestSupplier";
   
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
        
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`)
    });

    beforeEach(async()=>{     
    await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async()=>{
        await prisma!.user.delete({where:{id:userId}})
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new Supplier",async()=>{
       const Supplier= await  createSupplier({
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
        const Supplier2 = await updateSupplier({
            id:supplierId,
           city:"test",
        });
        expect(Supplier2.city?.trim()).toBe("test")
    });
    test("get unique Supplier",async ()=>{
        const supplier = await getUniqueSupplier(supplierId);
        expect(supplier?.id).toBe(supplierId)
        expect(supplier?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Supplier",async ()=>{
        const supplier = await findManySupplier({
            where:{name:{equals:SupplierName}}
        });
        expect(supplier.length).toBeGreaterThan(0)
        expect(supplier[0].name).toBe(SupplierName)
    })
    test("delete Supplier ",async ()=>{
        const supplier = await deleteSupplier(supplierId);
        expect(supplier?.id).toBe(supplierId)
        expect(supplier.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Supplier ",async ()=>{
        const supplier = await deleteManySupplier([supplierId]);
        expect(supplier).toStrictEqual({count:1})
    })
    
})

