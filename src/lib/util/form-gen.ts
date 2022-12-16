import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod';
import { ZodFirstPartyTypeKind, ZodFirstPartySchemaTypes, z, CustomErrorParams, ZodEffects, ZodTypeAny, number, ZodIssueCode, } from "zod";



type ParsedZodFieldType = {
    field: string,
    typeName: ZodFirstPartyTypeKind,
    allowedValues?:any[],
    literalValue?:any,
    inner?: ParsedZodFieldType | ParsedZodFieldType[]
}
type TraverseReturnType = ParsedZodFieldType | ParsedZodFieldType[]
export function traverseZodSchema<T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes>(schema: T, field: string=""): TraverseReturnType {
    let ast: ParsedZodFieldType | ParsedZodFieldType[] = [];
    let typeName = schema._def.typeName;
    //console.log(typeName);
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
        schema._def
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
        const shape = schema._def

        return { typeName, field };
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodLazy) {
       const shape = schema._def.getter()
        return { typeName, field, inner:traverseZodSchema(shape,field)};
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodLiteral) {
        const shape = schema._def.value;
        return { typeName, field ,literalValue:shape};
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodEnum) {
        const shape = schema._def.values;
        // console.debug(shape)
        return { typeName, field, allowedValues: shape }
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodEffects) {
        const shape = schema._def.schema;
        // console.debug(shape)
        return traverseZodSchema(shape,field);
    }
    if (schema._def.typeName == ZodFirstPartyTypeKind.ZodNativeEnum) {
        const shape = schema._def.values;
        //  console.debug(shape)
        return { typeName, field,allowedValues: shape };
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
    allowedValues?:InputOptionValues
    literalValue?:any
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
            required:parentType !== ZodFirstPartyTypeKind.ZodOptional,
            allowedValues: data.allowedValues,
            literalValue:data.literalValue
        })
    }
    return config;
}
export const getInputTypeFromZodType = (i: ZodFirstPartyTypeKind) => {
    if(i == ZodFirstPartyTypeKind.ZodBoolean) return "checkbox";
    if(i == ZodFirstPartyTypeKind.ZodEnum) return "select";
    return i.replace('Zod', '').toLowerCase()
  }
type InputOptionValues= Array<{label:string,value:any}> | string[] | number[];

type FormFieldOption={
    label?:string,
    refine?:Parameters<ZodTypeAny['refine']>,
    upload?:boolean,
    textArea?:boolean,
    ordering?:number,
    hidden?:boolean,
    options?: InputOptionValues 
}

export function useZodForm<T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes>(
    schema:T,fieldOptions:{[K: string]:FormFieldOption | undefined | null}={},
    props?:Parameters<typeof useForm>[0]){
 
 

 const [fieldConfig,refinedSchema] = useMemo(()=>{    
    const ast = traverseZodSchema(schema);
    const fieldConfig = getFieldsConfigFromSchemaAst(ast);
    const schema2= schema.superRefine((data,ctx)=>{
        
            for(let field of fieldConfig ){
                if(field.required && field.type == ZodFirstPartyTypeKind.ZodString){
                    const path = field.name.split(".").map((v)=>{
                        if(/[0-9]/g.test(v)){
                        return parseInt(v)
                        }
                        return v;
                    });
                    //TODO read value from path array
                    const value = data[path[0]]
                    console.log(value,path);
                    if(!value||value?.length<1){
                        //console.log(ctx.path)
                        const label = fieldOptions[field.name]?.label??field.name
                        ctx.addIssue({
                            code:ZodIssueCode.custom,
                            path:path,
                            message:`${label} is required`
                        });
                }
            }}

});
return [fieldConfig,schema2] as [typeof fieldConfig,typeof schema2];

},[schema,fieldOptions]);

const form=  useForm({resolver:zodResolver(refinedSchema),...props});
 const register = form.register;
 const errors = form.formState.errors;
 const isSubmitting = form.formState.isSubmitting;

const config = useMemo(()=>{
    return fieldConfig.map((v)=>{
        const valueAsDate = v.type == ZodFirstPartyTypeKind.ZodDate;
        const valueAsNumber = v.type == ZodFirstPartyTypeKind.ZodNumber;
        const label = fieldOptions[v.name]?.label
        const ordering = fieldOptions[v.name]?.ordering??Number.MAX_SAFE_INTEGER;
        const hidden = fieldOptions[v.name]?.hidden;
        const options = fieldOptions[v.name]?.options??v.allowedValues;
        const upload = fieldOptions[v.name]?.upload??false;
        const textArea = fieldOptions[v.name]?.textArea??false;
        const type= getInputTypeFromZodType(v.type);
        const disabled=isSubmitting;
        const error = errors[v.name]?.message?.toString();
        return {error,label,ordering,options,upload,textArea, props:{type,hidden,disabled,...register(v.name,{valueAsDate,valueAsNumber})},...v}
    }).sort((a,b)=>a.ordering-b.ordering);
},[refinedSchema,fieldConfig,register,isSubmitting,errors]);


return [config,form] as [typeof config,typeof form]
}