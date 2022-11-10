import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createCurrency ,deleteManyCurrency,deleteCurrency,findManyCurrency,getUniqueCurrency,updateCurrency} from "@/core/currency";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";
import { appRouter } from "@/lib/routers";

describe("Currencys operations",()=>{
    let tenantId:string | null;
    let currencyId:number=0;
    let userId:string;
    const subdomain="Currencys"
    const tenantName="tenantCurrencys"
    const testEmail = "Currency@example.com";
    const CurrencyName = "TestCurrency";
    let router: ReturnType<typeof appRouter.createCaller>

    beforeAll(async()=>{
        const user = await prisma!.user.create({
            data:{
                name:CurrencyName,
                email:testEmail,
            }
        })
        userId=user.id;
        const tenant = await createTenant({subdomain,name:tenantName,userId:userId});
        tenantId = tenant?.tenantId??null;
        router = appRouter.createCaller({session:null,tenantId});

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
    test("create new Currency",async()=>{
       const Currency= await  router.setting.currency.create({
        name:CurrencyName,
        symbol:"$",
        code:"xvx",
        tenantId:tenantId!
       });
        expect(Currency.name).toBe(CurrencyName)
        expect(Currency.symbol).toBe("$");       
        expect(Currency.id).not.toBe(0)
        currencyId=Currency.id;

    });
    test("update Currency",async()=>{
        const currency2 = await router.setting.currency.update({
            id:currencyId,
           code:"test",
           
        });
        expect(currency2.code?.trim()).toBe("test")
    });
    test("get unique Currency",async ()=>{
        const currency = await router.setting.currency.get(currencyId);
        expect(currency?.id).toBe(currencyId)
        expect(currency?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Currency",async ()=>{
        const currency = await router.setting.currency.search({
            where:{name:{equals:CurrencyName}}
        });
        expect(currency.length).toBeGreaterThan(0)
        expect(currency[0].name).toBe(CurrencyName)
    })
    test("delete Currency ",async ()=>{
        const currency = await router.setting.currency.delete(currencyId);
        expect(currency?.id).toBe(currencyId)
        expect(currency.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Currency ",async ()=>{
        const currency = await router.setting.currency.deleteMany([currencyId]);
        expect(currency).toStrictEqual({count:1})
    })
    
})

