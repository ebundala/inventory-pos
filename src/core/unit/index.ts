import {prisma,unimplimented} from "@/core";
import { Prisma, RecordStatus } from "@prisma/client";

export type CreateUnitInput={
  name:                  string
  shortName:             string 
  baseUnitId?:            number
  operator?:              string 
  operatorValue?:         number
  tenantId:              string
}
export const createUnit = async (input:CreateUnitInput)=>{
   const {tenantId,...data}=input;
   return prisma!.unit.create({
    include:{
        unit:true
    },
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
export const updateUnit = async (input:UpdateUnitInput)=>{
    const {id,...data}=input;
    return prisma!.unit.update({
        where:{
            id:id
        },
     include:{
         unit:true
     },
     data:{...data}
    })
 };
 export type UnitId=number
 export type UnitIds=Array<number>
export const getUniqueUnit = async (id:UnitId)=>{
   
    return prisma!.unit.findUnique({
        where:{
            id:id
        },
     include:{
         unit:true
     },    
    })
 };
export const deleteUnit = async (id:UnitId)=>{
   
    return prisma!.unit.update({
        where:{
            id:id
        },
     include:{
         unit:true
     },   
     data:{
        recordStatus: RecordStatus.DELETED
     } 
    })
 };
export const deleteManyUnit = async (ids:UnitIds)=>{
    return prisma!.unit.updateMany({
        where:{
            id:{in:ids}
        },  
        data:{
            recordStatus:RecordStatus.DELETED
        }     
    })
 };
 
export const findManyUnit =async(input: Omit<Prisma.UnitFindManyArgs,"select"|"include">) => {
    return prisma!.unit.findMany(
        input
    );
}