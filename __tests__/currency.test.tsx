import { createTenant, deleteManyTenant } from "@/core/tenant";
import { createCurrency ,deleteManyCurrency,deleteCurrency,findManyCurrency,getUniqueCurrency,updateCurrency} from "@/core/currency";
import {prisma} from "@/core"
import { RecordStatus } from "@prisma/client";

describe("Currencys operations",()=>{
    let tenantId:string | null;
    let currencyId:number=0;
    let userId:string;
    const subdomain="Currencys"
    const tenantName="tenantCurrencys"
    const testEmail = "Currency@example.com";
    const CurrencyName = "TestCurrency";
   
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
    test("create new Currency",async()=>{
       const Currency= await  createCurrency({
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
        const currency2 = await updateCurrency({
            id:currencyId,
           code:"test",
           
        });
        expect(currency2.code?.trim()).toBe("test")
    });
    test("get unique Currency",async ()=>{
        const currency = await getUniqueCurrency(currencyId);
        expect(currency?.id).toBe(currencyId)
        expect(currency?.recordStatus).toBe(RecordStatus.ACTIVE)
    })

    test("find many Currency",async ()=>{
        const currency = await findManyCurrency({
            search:CurrencyName.substring(2,4)
        });
        expect(currency.length).toBeGreaterThan(0)
        expect(currency[0].name).toBe(CurrencyName)
    })
    test("delete Currency ",async ()=>{
        const currency = await deleteCurrency(currencyId);
        expect(currency?.id).toBe(currencyId)
        expect(currency.recordStatus).toBe(RecordStatus.DELETED)

    })
    test("delete many Currency ",async ()=>{
        const currency = await deleteManyCurrency([currencyId]);
        expect(currency).toStrictEqual({count:1})
    })
    
})

