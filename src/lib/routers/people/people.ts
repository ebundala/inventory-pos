import { createCustomer, deleteManyCustomer, deleteCustomer, findManyCustomer, getUniqueCustomer, updateCustomer } from "@/core/customer";
import { createCustomerInputSchema, customerIdSchema, customerIdsSchema, updateCustomerInputSchema } from "@/core/customer/index.zod";
import { router, privateProcedure } from "@/core/trpc";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";
import { supplierRouter } from "./supplier";



export const customerRouter = router({
    create: privateProcedure
        .input(createCustomerInputSchema)
        .mutation(({ input, ctx }) => createCustomer(input)),

    update: privateProcedure
        .input(updateCustomerInputSchema)
        .mutation((({ input, ctx }) => updateCustomer(input))),
    get: privateProcedure
    .input(customerIdSchema)
    .query(({ input, ctx }) => getUniqueCustomer(input)),
    search: privateProcedure.input(CustomerFindManySchema)
    .query(({ input, ctx }) => findManyCustomer(input)),
    delete: privateProcedure
    .input(customerIdSchema)
    .mutation(({ input, ctx }) => deleteCustomer(input)),
   deleteMany: privateProcedure
    .input(customerIdsSchema)
    .mutation(({ input, ctx }) => deleteManyCustomer(input)),
    supplier:supplierRouter
})