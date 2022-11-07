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
 type UnitId=number
 type UnitsId=Array<number>
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
export const deleteManyUnit = async (ids:UnitsId)=>{
    return prisma!.unit.updateMany({
        where:{
            id:{in:ids}
        },  
        data:{
            recordStatus:RecordStatus.DELETED
        }     
    })
 };
 
export const findManyUnit =async( input: Pick<Prisma.UnitWhereInput, Prisma.UnitScalarFieldEnum> & {
    
    orderBy?: [Pick<Prisma.UnitOrderByWithRelationInput, Prisma.UnitScalarFieldEnum>]
    take?: number,
    skip?: number,
    cursor?: number,
    search?: string,
}) => {
    const { orderBy, take, skip, cursor, search, ...where } = input;
    let query: Pick<Prisma.UnitWhereInput, "OR"> | undefined;
    if (search) {
        const terms = Object.values(Prisma.UnitScalarFieldEnum).filter((v)=>["name","shortName"].includes(v)).map((v) => ({
            [v]: { contains: search }
        }));

        query = {
            OR: terms
        };
    };
    return prisma!.unit.findMany(
        {
            where: query ?? where,
            orderBy: orderBy,
            take, skip,
            cursor: cursor ? { id: cursor } : undefined,


        }
    );
}