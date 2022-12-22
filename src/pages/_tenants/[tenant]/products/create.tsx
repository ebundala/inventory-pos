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
import { getValue, isZodFormFieldArray, useZodForm, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { ZodFirstPartyTypeKind } from "zod";


export default function CreateProduct() {
    const [tenant, tenantLoading] = useTenant();
    const [categories, categoryLoading] = useCategories();
    const [brands, brandsLoading] = useBrands();
    const [units, unitsLoading] = useUnits();
    const options = useMemo((): Parameters<typeof useZodForm>[1] => {
        const unitsWithlabels = units?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const brandsWithlabels = brands?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const categoriesWithLabels = categories?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const barcodeSymbologyLabels = [{
            label: "Code 128",
            value: "Code 128"
        }, {
            label: "Code 39",
            value: "Code 39"
        }, {
            label: "EAN8",
            value: "EAN8"
        }, {
            label: "EAN13",
            value: "EAN13"
        }, {
            label: "UPC",
            value: "UPC"
        }];
        const taxMethods = [{ label: "Inclusive", value: "inclusive" }, { label: "Exclusive", value: "Exclusive" }];
        return {
            name: {
                label: "Product name",
                ordering: 1
            },
            code: {
                label: "Product code",
                ordering: 2
            },
            typeBarcode: {
                label: "Barcode symbology",
                ordering: 3,
                options: barcodeSymbologyLabels
            },
            cost: {
                label: "Purchase price",
                ordering: 4
            },
            price: {
                label: "Sale price",
                ordering: 5
            },
            categoryId: {
                label: "Category",
                ordering: 6,
                options: categoriesWithLabels
            },
            brandId: {
                label: "Brand",
                ordering: 6,
                options: brandsWithlabels
            },
            unitId: {
                label: "Stock unit",
                ordering: 7,
                options: unitsWithlabels
            },
            unitSaleId: {
                label: "Sale unit",
                ordering: 6,
                options: unitsWithlabels
            },
            unitPurchaseId: {
                label: "Purchase unit",
                ordering: 6,
                options: unitsWithlabels
            },
            taxNet: {
                label: "Order Tax (%)",
                ordering: 7
            },
            taxMethod: {
                label: "Tax method",
                ordering: 8,
                options: taxMethods
            },
            stockAlert: {
                label: "Stock alert",
                ordering: 9
            },
            note: {
                label: "Description",
                ordering: 10,
                textArea: true
            },
            image: {
                label: "Product images",
                // upload:true,
                ordering: 11
            },
            isVariant: {
                label: "Product has variants",
                ordering: 12
            },
            isActive: {
                label: "In sale",

            },
            isImei: {
                label: "Product has IMEI",
                hidden: true
            },
            "productVariants.0.name": {
                label: "Variant name",

            },
            "productVariants.0.qty": {
                label: "Quantity",
                hidden: true
            },
            tenantId: {
                hidden: true
            }
        }
    }, [units, categories, brands])
    const [config, form] = useZodForm(createProductInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId }
    });

    const [reguralConfig, fieldArrayConfig] = useMemo(() => {
        const regular: typeof config = []
        const fieldArray: typeof config = []
        for (let v of config) {
            if (isZodFormFieldArray(v.name)) {
                fieldArray.push(v);
            }
            else {
                regular.push(v);
            }
        }
        return [regular, fieldArray];
    }, [config])
    const fname = useMemo(() => fieldArrayConfig[0].name.split(".").slice(0, 1)[0], []);
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

function renderFieldArrayForm({ config, key, index,errors, register, name }:
    { config: ZodFormFieldConfig[]; key: string; errors:any, index: number; register: (name: string,opts:any) => any; name: string; }) {
    return config.map((v, i) => {
        const fieldName = v.name.split(".").slice(-1)[0];
        const error = getValue([name,index,fieldName], errors??{})?.message?.toString();
        const valueAsDate = v.type == ZodFirstPartyTypeKind.ZodDate;
        const valueAsNumber = v.type == ZodFirstPartyTypeKind.ZodNumber;
        const props = {...v,error, key: `${key}_${index}_${i}`, props: { ...v.props, ...register(`${name}.${index}.${fieldName}`,{ valueAsDate, valueAsNumber }) } }
        return (<FormInputField  {...props} />)
    })
}