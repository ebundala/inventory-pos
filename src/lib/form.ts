import { createSaleInputSchema } from "../../src/core/sale/index.zod";
import { ZodAny, ZodFirstPartyTypeKind, ZodTypeAny,ZodRawShape, ZodAnyDef, ZodFirstPartySchemaTypes } from "zod";
import { TenantCreateInputObjectSchema } from "../../prisma/generated/schemas/objects/TenantCreateInput.schema";
import { createSettingInputSchema } from "../../src/core/setting/index.zod";
import { createPosSettingInputSchema } from "../../src/core/pos_setting/index.zod";


type ParsedZodFieldType={
    field?:string,
    typeName:ZodFirstPartyTypeKind,
    inner?:ParsedZodFieldType | ParsedZodFieldType[]
}
type TraverseReturnType = ParsedZodFieldType | ParsedZodFieldType[]
function traverseZodSchema<T  extends ZodFirstPartySchemaTypes=ZodFirstPartySchemaTypes>(schema:T,field?:string):TraverseReturnType{
    let ast:ParsedZodFieldType | ParsedZodFieldType[]=[];
    let typeName = schema._def.typeName;
    
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodString  ){
        return {typeName, field};
    }

    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodNumber  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodNaN  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodBigInt  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodBoolean  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodDate  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodUndefined  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodNull  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodAny  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodUnknown  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodNever  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodVoid  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodArray  ){
        const shape=schema._def.type
        return {typeName, field,inner:traverseZodSchema(shape,field)};
    }

    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodObject){
        const shape = schema._def.shape();
        
     for (let key in shape){
        
          let v = shape[key];
        //   console.debug(key,v?._def?.typeName)
          let result =  traverseZodSchema(v,key);
          ast.push(result as any)
     }

     }

    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodUnion  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodDiscriminatedUnion  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodIntersection  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodTuple  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodRecord  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodMap  ){
        
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodSet  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodFunction  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodLazy  ){
        return {typeName, field};
    }
    if( schema._def.typeName == ZodFirstPartyTypeKind.ZodLiteral  ){
        return {typeName, field};
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodEnum){
        const shape = schema._def.values;
       // console.debug(shape)
       return {typeName,field,values:shape}
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodEffects){
        const shape = schema._def.effect;
       // console.debug(shape)
       return {typeName, field}
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodNativeEnum){
        const shape = schema._def.values;
     //  console.debug(shape)
     return {typeName, field};
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodOptional){
        const shape = schema._def.innerType;
        
       return {typeName,field,inner:traverseZodSchema(shape,field)};
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodNullable){
        const shape = schema._def.innerType;
        return {typeName,field,inner:traverseZodSchema(shape,field)};
    }
    
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodDefault){
        const shape = schema._def.innerType;
        return {typeName,field,inner:traverseZodSchema(shape,field)};
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodPromise){
        const shape = schema._def.type;
        return {typeName, field};
    }
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodBranded){
        const shape = schema._def.type;
        return {typeName, field};
    }

    return ast;
}



console.log(traverseZodSchema(createSaleInputSchema))