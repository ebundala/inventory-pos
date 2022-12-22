import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { createProductInputSchema } from "@/core/product/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useBrands } from "@/lib/hooks/useBrands";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useUnits } from "@/lib/hooks/useUnits";
import { useZodForm } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useProductFormFieldOptions } from "@/lib/hooks/useProductFormFieldOptions";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";


export default function CreateProduct() {
    const [tenant, tenantLoading] = useTenant();
    const [categories, categoryLoading] = useCategories();
    const [brands, brandsLoading] = useBrands();
    const [units, unitsLoading] = useUnits();
    const options = useProductFormFieldOptions(units,brands,categories);
    const [config, form] = useZodForm(createProductInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId }
    });

    const [reguralConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const fname = useFieldArrayName(fieldArrayConfig);
    const hasVariant = form.watch("isVariant", false);
    const productVariantsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });
       useMemo(()=>{
        const len = productVariantsForm.fields.length;
        if(!hasVariant&&len>0){
            
            for(let i=0;i<len;i++ ){
            productVariantsForm.remove(i)
            }
        }
       },[hasVariant])
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.product.create.useMutation();
    if (tenantLoading || categoryLoading || brandsLoading || unitsLoading) return <Loader />

    return (
        <FormContainer title={<h2>Create product</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                await result.mutateAsync(data as any);
                form.reset();
                console.log(data);
            }, (e) => {
                console.error(e);
            })}>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {reguralConfig.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
                    })}

                </div>
                {hasVariant && <div className="w-full bg-gray-200 p-4 rounded-md">
                    <div className="h-10 w-full">
                        <h2>Products variants</h2>
                    </div>
                    <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {productVariantsForm.fields.map((item, i) => {

                            return <div key={item.key} className="flex flex-col gap-3 p-4 border-[1px] border-gray-500 rounded-md">
                                <div className="flex-none">#{i + 1}</div>
                                <div className="flex flex-col">
                                    {renderFieldArrayForm({ config: fieldArrayConfig,errors:form.formState.errors, index: i, key: item.key, register: form.register, name: fname })}
                                </div>
                                <div className="flex-none">
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        productVariantsForm.remove(i);
                                        console.log(i);
                                    }} className="btn btn-outline btn-accent btn-xs rounded-md"> remove</button>
                                </div>
                            </div>
                        })}
                    </div>
                    <button onClick={(e) => {
                        e.preventDefault();
                        productVariantsForm.append({ name: "", qty:0 })
                    }} className="btn btn-outline btn-accent btn-xs rounded-md my-4">add variant</button>
                </div>}

                <div className="flex flex-row py-3 justify-start">

                    <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}

CreateProduct.getLayout = getLayout;


