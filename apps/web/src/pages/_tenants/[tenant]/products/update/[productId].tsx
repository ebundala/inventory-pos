import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateProductInputSchema } from "@/core/product/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useProduct } from "@/lib/hooks/useProduct";
import { useProductFormFieldOptions } from "@/lib/hooks/useProductFormFieldOptions";
import { useEffect } from 'react';
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { Prisma } from "@prisma/client";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";

interface ProductPathProps extends ParsedUrlQuery {
    productId: string;
}
export function UpdateProduct({tenant,product,refetch}:ProductRequiredDataReturnType['data']) {
    
    const options = useProductFormFieldOptions(product as any);
   
    const [config, form] = useZodForm(updateProductInputSchema, options, {
        defaultValues: { ...(product ?? {})}
    });
    const [noteField,config2] = useGetZodFormField(Prisma.ProductScalarFieldEnum.note,config);
    const [boolFields,config3] = useGetZodFormFields([
     Prisma.ProductScalarFieldEnum.isVariant,
     Prisma.ProductScalarFieldEnum.isActive,
     Prisma.ProductScalarFieldEnum.isImei
    ],config2);
    const [reguralConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config3)

    const fname = useFieldArrayName(fieldArrayConfig);

    const hasVariant = form.watch("isVariant", false);
    const productVariantsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });
    const trpcWithHost = useTrpcTenant();
    useEffect(()=>{
        if(product){
            // set initial form state         
            form.reset(product);            
        }
    },[])

   const {showProgress,callbacks} = useProgressFeedback("/products")
    
    const result = trpcWithHost.product.update.useMutation(callbacks);
    
    if (!product || !product?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid product</span>
        </div>)
    return (
        <FormContainer title={<h2>Update product</h2>}>
            <form >
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {reguralConfig.map((i, index) => {
                        return (<FormInputField key={`${i.name}.${index}`} {...i} />);
                    })}
                </div>
                <div className="grid grid-flow-row xs:grid-cols-1 ">
                {noteField&&<FormInputField key={noteField.name} {...noteField} />}
                </div>

                {boolFields.map((i) => {
                        return (
                        <div key={i.name} className="grid grid-flow-row xs:grid-cols-1   sm:grid-cols-2 md:grid-cols-3 gap-3">

                        <FormInputField  {...i} />
                        </div> 
                        );
                    })}
                {hasVariant && <div className="w-full p-4 rounded-md">
                    <div className="h-10 w-full border-gray-400 border-b">
                        <h2 className="text-lg font-semibold">Product variants</h2>
                    </div>
                    <div className="mt-4 grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {productVariantsForm.fields.map((item, i) => {

                            return <div key={item.key} className="flex flex-col gap-3 p-4 border-[1px] shadow-sm rounded-md bg-white">
                                <div className="flex-none">#{i + 1}</div>
                                <div className="flex flex-col">
                                    {renderFieldArrayForm({ config: fieldArrayConfig, errors: form.formState.errors, index: i, key: item.key, register: form.register, name: fname })}
                                </div>
                                <div className="flex-none">
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        productVariantsForm.remove(i);                                       
                                    }} className="btn btn-outline btn-accent btn-xs rounded-md"> remove</button>
                                </div>
                            </div>
                        })}
                    </div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        productVariantsForm.append({ name: "", qty: 0 ,id:-1})
                    }} className="btn btn-outline btn-accent btn-xs rounded-md my-4">add variant</button>
                </div>}
                <div className="flex flex-row py-3 justify-start">
                    
                    <button type="submit" className="btn btn-primary rounded-md  " 
                    onClick={form.handleSubmit(async (data) => {
                
                        //submit here
                        showProgress({animated:true})
                        await result.mutateAsync(data as any);
                        refetch();
                       
                    }, (e) => {
                        console.error(e);
                    })}
                    >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useProductRequiredData}>
            {(props)=>{
                return <UpdateProduct {...props}/>
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function useProductRequiredData() {
    const router = useRouter();
    const productId = parseInt((router.query as ProductPathProps).productId ?? "");
    const {product, result:{isLoading:loading,}, refetch} = useProduct(productId);
    const {tenant, result:{isLoading:tenantLoading}} = useTenant();    
    return {data:{ tenant, product,refetch },isLoading: tenantLoading || loading};
}
type ProductRequiredDataReturnType = ReturnType<typeof useProductRequiredData>


