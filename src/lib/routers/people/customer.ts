import { createCustomer, deleteManyCustomer, deleteCustomer, findManyCustomer, getUniqueCustomer, updateCustomer } from "@/core/customer";
import { createCustomerInputSchema, customerIdSchema, customerIdsSchema, updateCustomerInputSchema } from "@/core/customer/index.zod";
import { router, privateProcedureWithTx } from "@/core/trpc";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";
import { supplierRouter } from "./supplier";



export const customerRouter = router({
    create: privateProcedureWithTx
        .input(createCustomerInputSchema)
        .mutation(({ input, ctx }) => createCustomer(input)),

    update: privateProcedureWithTx
        .input(updateCustomerInputSchema)
        .mutation((({ input, ctx }) => updateCustomer(input))),
    get: privateProcedureWithTx
    .input(customerIdSchema)
    .query(({ input, ctx }) => getUniqueCustomer(input)),
    search: privateProcedureWithTx.input(CustomerFindManySchema)
    .query(({ input, ctx }) => findManyCustomer(input)),
    delete: privateProcedureWithTx
    .input(customerIdSchema)
    .mutation(({ input, ctx }) => deleteCustomer(input)),
   deleteMany: privateProcedureWithTx
    .input(customerIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCustomer(input)),
    supplier:supplierRouter,
   
})