/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createProductInputSchema } from "@/core/product/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useProductFormFieldOptions } from "@/lib/hooks/useProductFormFieldOptions";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Prisma } from "@prisma/client";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";


export function CreateProduct() {
    const { tenant } = useTenant();

    const options = useProductFormFieldOptions();
    const [config, form] = useZodForm(createProductInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId }
    });
   const [noteField,config2] = useGetZodFormField(Prisma.ProductScalarFieldEnum.note,config);
   const [boolFields,config3] = useGetZodFormFields([
    Prisma.ProductScalarFieldEnum.isVariant,
    Prisma.ProductScalarFieldEnum.isActive,
    Prisma.ProductScalarFieldEnum.isImei
   ],config2);

    const [reguralConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config3)
    const fname = useFieldArrayName(fieldArrayConfig);
    const hasVariant = form.watch(Prisma.ProductScalarFieldEnum.isVariant, false);
    const productVariantsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });
    useMemo(() => {
        const len = productVariantsForm.fields.length;
        if (!hasVariant && len > 0) {

            for (let i = 0; i < len; i++) {
                productVariantsForm.remove(i)
            }
        }
    }, [hasVariant])

    const trpcWithHost = useTrpcTenant();
    const {showProgress,callbacks} = useProgressFeedback("/products")

    const result = trpcWithHost.product.create.useMutation(callbacks);

    return (
        <FormContainer title={<h2>Create product</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                showProgress({animated:true});
                await result.mutateAsync(data as any);
               
            }, (e) => {
                console.error(e);
            })}>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {reguralConfig.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
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
                  
                {hasVariant && <div className="w-full bg-gray-200 p-4 rounded-md">
                    <div className="h-10 w-full">
                        <h2>Products variants</h2>
                    </div>
                    <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {productVariantsForm.fields.map((item, i) => {

                            return <div key={item.key} className="flex flex-col gap-3 p-4 border-[1px] border-gray-500 rounded-md">
                                <div className="flex-none">#{i + 1}</div>
                                <div className="flex flex-col">
                                    {renderFieldArrayForm({ config: fieldArrayConfig, errors: form.formState.errors, index: i, key: item.key, register: form.register, name: fname })}
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
                        productVariantsForm.append({ name: "", qty: 0 })
                    }} className="btn btn-outline btn-accent btn-xs rounded-md my-4">add variant</button>
                </div>}

                <div className="flex flex-row py-3 justify-start">

                    <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = useTenant();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <CreateProduct {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;


