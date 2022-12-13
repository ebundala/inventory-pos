import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod';
import { ZodFirstPartyTypeKind, ZodFirstPartySchemaTypes } from "zod";



type ParsedZodFieldType = {
    field: string,
    typeName: ZodFirstPartyTypeKind,
    inner?: ParsedZodFieldType | ParsedZodFieldType[]
}
type TraverseReturnType = ParsedZodFieldType | ParsedZodFieldType[]
export function traverseZodSchema<T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes>(schema: T, field: string=""): TraverseReturnType {
    let ast: ParsedZodFieldType | ParsedZodFieldType[] = [];
    let typeName = schema._def.typeName;

    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodString) {
        return { typeName, field };
    }

    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNumber) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNaN) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodBigInt) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodBoolean) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodDate) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodUndefined) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNull) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodAny) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodUnknown) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNever) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodVoid) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodArray) {
        const shape = schema._def.type
        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }

    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodObject) {
        const shape = schema._def.shape();

        for (let key in shape) {

            let v = shape[key];
            //   console.debug(key,v?._def?.typeName)
            let result = traverseZodSchema(v, key);
            ast.push(result as any)
        }

    }

    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodUnion) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodDiscriminatedUnion) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodIntersection) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodTuple) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodRecord) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodMap) {

        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodSet) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodFunction) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodLazy) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodLiteral) {
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodEnum) {
        const shape = schema._def.values;
        // console.debug(shape)
        return { typeName, field, values: shape }
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodEffects) {
        const shape = schema._def.effect;
        // console.debug(shape)
        return { typeName, field }
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNativeEnum) {
        const shape = schema._def.values;
        //  console.debug(shape)
        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodOptional) {
        const shape = schema._def.innerType;

        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNullable) {
        const shape = schema._def.innerType;
        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }

    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodDefault) {
        const shape = schema._def.innerType;
        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodPromise) {
        const shape = schema._def.type;
        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodBranded) {
        const shape = schema._def.type;
        return { typeName, field, inner: traverseZodSchema(shape, field) };
    }

    return ast;
}
type FormFieldConfig = {
    required: Boolean
    name: string
    type: ZodFirstPartyTypeKind
}
export function getFieldsConfigFromSchemaAst(data: TraverseReturnType, parentField: string="", parentType: string = '', config: FormFieldConfig[] = []) {
    const fieldName = (field: string,parent:string, isArray: boolean, isObject: boolean) => `${parent}${isArray ? `.0.${field}` : isObject ? `.${field}` : field}`;
    const isArray = (t: string) => t === ZodFirstPartyTypeKind.ZodArray
    const isObject = (t: string) => t === ZodFirstPartyTypeKind.ZodObject

    if (data instanceof Array) {
        //console.log("object", parentField, parentType)

        for (let v of data as ParsedZodFieldType[]) {
            getFieldsConfigFromSchemaAst(v, fieldName(v.field,parentField, isArray(parentType), isObject(parentType)), '', config)
        }
    }
    else if (data.inner) {
       
        getFieldsConfigFromSchemaAst(data.inner,parentField , data.typeName, config);
    }
    else {
        //console.log("--", parentField, data.typeName, parentType)
        config.push({
            name:parentField,
            type:data.typeName,
            required:parentType !== ZodFirstPartyTypeKind.ZodOptional
        })
    }
    return config;
}


function useZodForm<T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes>(schema:T,props?:Parameters<typeof useForm>[0]){
    
 const form=  useForm({resolver:zodResolver(schema),...props});
 const config = useMemo(()=>{
    const ast = traverseZodSchema(schema);
    const config = getFieldsConfigFromSchemaAst(ast);
    return config.map((v)=>{
        const valueAsDate = v.type == ZodFirstPartyTypeKind.ZodDate;
        const valueAsNumber = v.type == ZodFirstPartyTypeKind.ZodNumber;
        return {props:form.register(v.name,{valueAsDate,valueAsNumber}),...v}
    });
},[schema,form]);
return [config,form]
}