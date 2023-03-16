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
export function ViewProduct({tenant,product,refetch}:ProductRequiredDataReturnType['data']) {
    
   
    
    if (!product || !product?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid product</span>
        </div>)
    return (
        <FormContainer title={<h2>{product.name}</h2>}>
           
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useProductRequiredData}>
            {(props)=>{
                return <ViewProduct {...props}/>
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


