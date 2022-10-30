import { createCompany ,deleteCompany,getUniqueCompany,updateCompany} from "@/core/company";


describe("Company operations",()=>{
    
    test("create new Company",async()=>{
       const company= await  createCompany();
        expect(company).toBe(1)
    });
    test("update Company",async()=>{
        const company = await updateCompany();
        expect(company).toBe(1)

    });
    test("get unique Company",async ()=>{
        const company = await getUniqueCompany();
        expect(company).toBe(1)

    })
    test("delete Company ",async ()=>{
        const company = await deleteCompany();
        expect(company).toBe(1)

    })

    
})

