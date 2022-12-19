import { createCustomer, deleteManyCustomer, deleteCustomer, findManyCustomer, getUniqueCustomer, updateCustomer } from "@/core/customer";
import { createCustomerInputSchema, customerIdSchema, customerIdsSchema, updateCustomerInputSchema } from "@/core/customer/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";
import { supplierRouter } from "./supplier";



export const customerRouter = router({
    create: privateProcedureWithTx
        .input(createCustomerInputSchema)
        .mutation(({ input, ctx }) => createCustomer(input,ctx as TenantContext)),

    update: privateProcedureWithTx
        .input(updateCustomerInputSchema)
        .mutation((({ input, ctx }) => updateCustomer(input, ctx as TenantContext))),
    get: privateProcedureWithTx
    .input(customerIdSchema)
    .query(({ input, ctx }) => getUniqueCustomer(input, ctx as TenantContext)),
    search: privateProcedureWithTx.input(CustomerFindManySchema)
    .query(({ input, ctx }) => findManyCustomer(input, ctx as TenantContext)),
    delete: privateProcedureWithTx
    .input(customerIdSchema)
    .mutation(({ input, ctx }) => deleteCustomer(input, ctx as TenantContext)),
   deleteMany: privateProcedureWithTx
    .input(customerIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCustomer(input, ctx as TenantContext)),
    supplier:supplierRouter,
   
})