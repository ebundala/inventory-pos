import {prisma} from '@/core';
import { ProcessStatus, RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";



describe("Tenant operations",()=>{
let tenantId:string="xx";
let userId:string;
const subdomain="pos"
const tenantName="tenant1"
const testEmail = "email@example.com";
let router: ReturnType<typeof appRouter.createCaller>

   beforeAll(async()=>{
    const user = await prisma!.user.create({
        data: {
            name: tenantName,
            email: testEmail,
        }
    })
    userId = user.id;
    router =appRouter.createCaller({session:null,tenantId});

   });
    // beforeEach(async()=>{     
    // await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
    // })

    afterAll(async()=>{
        await prisma!.$queryRawUnsafe(`SET "app.CurrentTenant"="${tenantId}"`);
        await prisma!.tenantInvite.delete({
            where:{
                tenantId_email:{
                    email:testEmail,
                    tenantId:tenantId!
                }
            }
        }).catch((e)=>{})
        await prisma!.user.delete({where:{id:userId}}).catch((e)=>{});
        await prisma!.tenant.deleteMany({
            where:{
                subdomain:{equals:subdomain}
            }
        }).catch((e)=>{})
    });
    test("create new tenant",async()=>{
       const tenant= await  router.tenant.create({
        name:tenantName,
        userId:userId,
        subdomain:subdomain
       });
         tenantId = tenant.tenantId;
         //ovewrite caller with valid tenant id
         router =appRouter.createCaller({session:null,tenantId});

        expect(tenant.subdomain).toBe(subdomain)
        expect(tenant.members[0].id).toBe(userId)
        expect(tenant.name).toBe(tenantName)
    });

    test("update tenant",async()=>{
        const tenant = await router.tenant.update({
            tenantId:tenantId!,
            image:"pic",
            description:"disc"
        });
        expect(tenant.image).toBe("pic");
        expect(tenant.description).toBe("disc")
        expect(tenant.tenantId).toBe(tenantId)

    });
    test("get unique tenant",async ()=>{
        const tenant = await router.tenant.get(tenantId!);
        expect(tenant!.image).toBe("pic");
        expect(tenant!.description).toBe("disc")
        expect(tenant!.tenantId).toBe(tenantId)
        expect(tenant!.members.length).toBe(1)
        expect(tenant!.members[0].id).toBe(userId)
    })
    test("find many tenant",async ()=>{
        const tenant = await router.tenant.search({
            where:{name:{equals:tenantName}}
        });       
        expect(tenant[0].tenantId).toBe(tenantId)
        
    })
    test("invite members",async ()=>{
        
        const invite = await router.tenant.inviteMember({
           userId:userId,
           tenantId:tenantId!,
           email:testEmail
        });
        expect(invite.tenant.tenantId).toBe(tenantId)
        expect(invite.email).toBe(testEmail)
        expect(invite.invitor.id).toBe(userId)
        

    })
    test("accept invite",async ()=>{
        const invite = await router.tenant.acceptInvite({
         email: testEmail,tenantId:tenantId!
        });
        expect(invite.status).toBe(ProcessStatus.APPROVED)

    })
    test("reject invite",async ()=>{
        const invite = await router.tenant.declineInvite({
            email: testEmail,tenantId:tenantId!
           });
           expect(invite.status).toBe(ProcessStatus.DENIED)

    })
    test("remove member",async ()=>{
        const tenant = await router.tenant.removeMember({
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
        const user = await router.tenant.leaveTenant({
            tenantId:tenantId!,
            userId:userId
        });
        expect(user.tenants.length).toBe(0)

    })
    test("delete tenant ",async ()=>{
        const tenant = await router.tenant.delete(tenantId!);
        expect(tenant.tenantId).toBe(tenantId)
        expect(tenant.recordStatus).toBe(RecordStatus.DELETED)
    })
    

    test("delete many tenant ",async ()=>{
        const payload = await router.tenant.deleteMany([tenantId!]);
        expect(payload).toStrictEqual({"count":1})

    })
})

