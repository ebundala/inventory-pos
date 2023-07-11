import { prisma,} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";

export type CreateCustomerInput = {
    name         :string
    code         :number
    email        :string      
    country      :string
    city         ?:string
    phone        ?:string
    address      ?:string
}
export const createCustomer = async (input: CreateCustomerInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "customer",
      action: "create"
    });
    return ctx.tx!.customer.create({
        data:{tenantId,...input}
   })
}
export type UpdateCustomerInput = {
  id: number
  name         ?:string
  code         ?:number
  email        ?:string      
  country      ?:string
  city         ?:string
  phone        ?:string
  address      ?:string
}
export const updateCustomer = async (input: UpdateCustomerInput,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "currency",
      action: "update"
    });
    const { id, ...data } = input;
    return ctx.tx!.customer.update({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        },        
        data: { ...data }
    })
};
export type CustomerId = number
export type CustomerIds = Array<number>
export const getUniqueCustomer = async (id: CustomerId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "customer",
      action: "view"
    });
    return ctx.tx!.customer.findUnique({
        where: {
            id: id,recordStatus:RecordStatus.ACTIVE 
        }        
    })
};
export const deleteCustomer = async (id: CustomerId,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "customer",
      action: "delete"
    });
    return ctx.tx!.customer.update({
        where: {
            id: id
        },      
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};
export const deleteManyCustomer = async (ids: CustomerIds,ctx:TenantContext) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "customer",
      action: "delete"
    });
    return ctx.tx!.customer.updateMany({
        where: {
            id: { in: ids }
        },
        data: {
            recordStatus: RecordStatus.DELETED
        }
    })
};

export const findManyCustomer = async  (input: Omit<Prisma.CustomerFindManyArgs, "select"|"include">,ctx:TenantContext ) => {
    const {tenantId,session,enforcer} = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "customer",
      action: "view"
    });
    const {where,...rest}=input;
    return ctx.tx!.customer.findMany(
        {
            where:{...where,recordStatus:RecordStatus.ACTIVE },
            ...rest
        }
    );
}