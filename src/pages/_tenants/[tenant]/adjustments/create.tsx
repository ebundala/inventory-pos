import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Prisma } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
import { useAdjustmentFormFieldOptions } from "@/lib/hooks/useAdjustmentFormFieldOptions";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch } from "@/lib/hooks/useProductSearch";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormField,} from "@/lib/hooks/useGetZodFormField";




export function CreateAdjustment({ tenant, user, warehouses, setting }: TAppConfig) {

    const options = useAdjustmentFormFieldOptions(warehouses)

    const [config, form] = useZodForm(createAdjustmentInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, items: 0 }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const fname = useFieldArrayName(fieldArrayConfig);

    const adjustmentDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.adjustment.create.useMutation();

    useMemo(() => {
        console.log("adjustment details changed");
        form.setValue(Prisma.AdjustmentScalarFieldEnum.items, adjustmentDetailsForm.fields.length)
    }, [adjustmentDetailsForm.fields.length]);

    useEffect(() => {
        form.setValue(Prisma.AdjustmentScalarFieldEnum.date, new Date())
        form.setValue(Prisma.AdjustmentScalarFieldEnum.ref, Date.now().toString())
        //   form.setValue(Prisma.AdjustmentScalarFieldEnum.userId,Date.now().toLocaleString())

    }, [])
    const errors = form.formState.errors;

    const detailsData = useRenderFieldArrayForm(fname,adjustmentDetailsForm,form,fieldArrayConfig);

    const [ notesField, otherFields ] = useGetZodFormField(Prisma.AdjustmentScalarFieldEnum.notes,regularConfig)


    return (
        <FormContainer title={<h2>Create Adjustment</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                console.log(data);
                await result.mutateAsync(data as any);
                form.reset();

            }, (e) => {
                console.error(e);
            })}>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 gap-3">
                    {otherFields.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
                    })}

                </div>
                <div className="w-full">
                    <FormComboBox
                        label="Products"
                        name="Product search"
                        required={true}
                        error={undefined}
                        keyPath={(v) => getProductFormatedName(v as any)}
                        displayValuePath={(v) => getProductFormatedName(v as any)}
                        onChange={(e, reset) => {
                            const v = e.target.value;
                            //console.log(v)
                            adjustmentDetailsForm.append(v);
                            if (reset) {
                                reset();
                         
                            }
                    
                        }}
                        useGetDataHook={() => {
                            const [_, result, labels, setSearchText] = useProductSearch()
                            return [labels, setSearchText, result.isLoading]
                        }}

                        props={{ type: "search", hidden: false, disabled: false, }}
                    />
                </div>

                <div className="w-full  ">
                    <CustomTable rowsData={detailsData} collumsData={() => [
                        {
                            Header: "Product code",
                            accessor: "product.code",
                            disableSortBy: true
                        },
                        {
                            Header: "Product",
                            accessor: "productId",
                            disableSortBy: true,
                            Cell: ({ row }: { row: any }) => {
                                return getProductFormatedName(row.original)
                            }
                        },
                        {
                            Header: "Stock",
                            accessor: "stock",
                            disableSortBy: true
                        },
                        {
                            Header: "Quantity",
                            accessor: "fields.2",
                            disableSortBy: true,

                        },
                        {
                            Header: "Type",
                            accessor: "fields.3",
                            disableSortBy: true
                        },
                        {
                            Header: "",
                            accessor: "__",
                            disableSortBy: true
                        },
                        {
                            Header: "",
                            accessor: "fields.1",
                            disableSortBy: true
                        },
                        {
                            Header: "",
                            accessor: "action",
                            disableSortBy: true,
                            Cell: ({ row }: { row: any }) => {
                                return <button onClick={() => adjustmentDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
                            }
                        }
                    ]} search={false} pagenation={false} />
                </div>
                <div className="w-full">
                    <FormInputField  {...notesField as any} />
                </div>
                <div className="flex flex-row py-3 justify-start">

                    <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}


export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useAppConfig}>
            {(props) => <CreateAdjustment {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;




