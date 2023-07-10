import {prisma,unimplimented} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";
import { TenantContext } from "../trpc";
import { enforceHelper } from "../util/enforcerUtil";
const include={
    unit:true
}
export type CreateUnitInput={
  name:                  string
  shortName:             string 
  baseUnitId?:            number
  operator?:              string 
  operatorValue?:         number
  tenantId:              string
}
export const createUnit = async (input:CreateUnitInput,ctx:TenantContext)=>{
    const { tenantId, session, enforcer } = ctx;
    const userId = session!.user.id!;
    await enforceHelper({
      enforcer,
      tenantId,
      userId,
      resource: "unit",
      action: "create"
    });
    const {tenantId:_,...data}=input;
   return ctx.tx!.unit.create({
    include,
    data:{...data,tenantId:tenantId}
   })
}
export type UpdateUnitInput={
    id:    number
    name?:                  string
    shortName?:             string 
    baseUnitId?:            number
    operator?:              string 
    operatorValue?:         number   
  }
export const updateUnit = async (input:UpdateUnitInput,ctx:TenantContext)=>{
    const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "unit",
    action: "update"
  });
    const {id,...data}=input;
    return ctx.tx!.unit.update({
        where:{
            id:id,  recordStatus:RecordStatus.ACTIVE,
        },
     include,
     data:{...data}
    })
 };
 export type UnitId=number
 export type UnitIds=Array<number>
export const getUniqueUnit = async (id:UnitId,ctx:TenantContext)=>{
    const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "unit",
    action: "view"
  });
    return ctx.tx!.unit.findUnique({
        where:{
            id:id,  recordStatus:RecordStatus.ACTIVE,
        },
     include  
    })
 };
export const deleteUnit = async (id:UnitId,ctx:TenantContext)=>{
   
    return ctx.tx!.unit.update({
        where:{
            id:id
        },
     include,
     data:{
        recordStatus: RecordStatus.DELETED
     } 
    })
 };
export const deleteManyUnit = async (ids:UnitIds,ctx:TenantContext)=>{
    const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "unit",
    action: "delete"
  });
    return ctx.tx!.unit.updateMany({
        where:{
            id:{in:ids}
        },  
        data:{
            recordStatus:RecordStatus.DELETED
        }     
    })
 };
 
export const findManyUnit =async(input: Omit<Prisma.UnitFindManyArgs,"select"|"include">,ctx:TenantContext) => {
    const { tenantId, session, enforcer } = ctx;
  const userId = session!.user.id!;
  await enforceHelper({
    enforcer,
    tenantId,
    userId,
    resource: "unit",
    action: "view"
  });
    const {where,...rest}=input;
    return ctx.tx!.unit.findMany(
        {...rest,include,where:{...where,  recordStatus:RecordStatus.ACTIVE,}}
    );
}