import { acceptInvite, createTenant ,deleteManyTenant,
    deleteTenant,findManyTenant,getUniqueTenant,inviteMember,
    leaveTenant,rejectInvite,removeMember,updateTenant} from "@/core/tenant";
import {prisma} from '@/core';
import { ProcessStatus, RecordStatus } from "@prisma/client";



describe("Tenant operations",()=>{
let tenantId:string|null="xx";
let userId:string;
const subdomain="pos"
const tenantName="tenant1"
const testEmail = "email@example.com";
   beforeAll(async()=>{
    const user = await prisma!.user.create({
        data: {
            name: tenantName,
            email: testEmail,
        }
    })
    userId = user.id;
   });
    beforeEach(async()=>{     
    await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    })

    afterAll(async()=>{
        await prisma!.tenantInvite.delete({
            where:{
                tenantId_email:{
                    email:testEmail,
                    tenantId:tenantId!
                }
            }
        })
        await prisma!.user.delete({where:{id:userId}}).catch((e)=>{});
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        })
    });
    test("create new tenant",async()=>{
       const tenant= await  createTenant({
        name:tenantName,
        userId:userId,
        subdomain:subdomain
       });
         tenantId = tenant.tenantId;
        expect(tenant.subdomain).toBe(subdomain)
        expect(tenant.members[0].id).toBe(userId)
        expect(tenant.name).toBe(tenantName)
    });

    test("update tenant",async()=>{
        const tenant = await updateTenant({
            tenantId:tenantId!,
            image:"pic",
            description:"disc"
        });
        expect(tenant.image).toBe("pic");
        expect(tenant.description).toBe("disc")
        expect(tenant.tenantId).toBe(tenantId)

    });
    test("get unique tenant",async ()=>{
        const tenant = await getUniqueTenant(tenantId!);
        expect(tenant!.image).toBe("pic");
        expect(tenant!.description).toBe("disc")
        expect(tenant!.tenantId).toBe(tenantId)
        expect(tenant!.members.length).toBe(1)
        expect(tenant!.members[0].id).toBe(userId)
    })
    test("find many tenant",async ()=>{
        const tenant = await findManyTenant({
            where:{name:{equals:tenantName}}
        });       
        expect(tenant[0].tenantId).toBe(tenantId)
        
    })
    test("invite members",async ()=>{
        
        const invite = await inviteMember({
           userId:userId,
           tenantId:tenantId!,
           email:testEmail
        });
        expect(invite.tenant.tenantId).toBe(tenantId)
        expect(invite.email).toBe(testEmail)
        expect(invite.invitor.id).toBe(userId)
        

    })
    test("accept invite",async ()=>{
        const invite = await acceptInvite({
         email: testEmail,tenantId:tenantId!
        });
        expect(invite.status).toBe(ProcessStatus.APPROVED)

    })
    test("reject invite",async ()=>{
        const invite = await rejectInvite({
            email: testEmail,tenantId:tenantId!
           });
           expect(invite.status).toBe(ProcessStatus.DENIED)

    })
    test("remove member",async ()=>{
        const tenant = await removeMember({
            userId:userId,tenantId:tenantId!
        });
        expect(tenant.members.length).toBe(0)
       const connect = await prisma!.tenant.update({
        where:{tenantId:tenantId!},
        include:{
            members:true
        },
        data:{
            members:{
                connect:{id:userId}
            }
        }})
        expect(connect!.members.length).toBe(1)
        expect(connect!.members[0].id).toBe(userId)
         
        
    })

    test("leave tenant ",async ()=>{      
        const user = await leaveTenant({
            tenantId:tenantId!,
            userId:userId
        });
        expect(user.tenants.length).toBe(0)

    })
    test("delete tenant ",async ()=>{
        const tenant = await deleteTenant(tenantId!);
        expect(tenant.tenantId).toBe(tenantId)
        expect(tenant.recordStatus).toBe(RecordStatus.DELETED)
    })
    

    test("delete many tenant ",async ()=>{
        const payload = await deleteManyTenant([tenantId!]);
        expect(payload).toStrictEqual({"count":1})

    })
})

