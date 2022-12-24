import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { createAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useBrands } from "@/lib/hooks/useBrands";
import { useCategories } from "@/lib/hooks/useCategories";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useUnits } from "@/lib/hooks/useUnits";
import { useZodForm, ZodFormFieldConfig, ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useEffect, useMemo, useState } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { useWarehouses } from "@/lib/hooks/useWarehouses";
import { useSession } from "next-auth/react";
import { useSetting } from "@/lib/hooks/useSetting";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Product, Prisma, Brand, Category, Customer, ProductVariant, Unit } from '@prisma/client'
import { z, ZodFirstPartySchemaTypes } from "zod";
import { ProductFindManySchema } from 'prisma/generated/schemas/findManyProduct.schema'
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";
import { useDebounce } from "use-debounce";
import { FormComboBox } from "./combobox";
import { CustomTable } from "@/components/table";

function useCreateAdjustmentRequiredData() {
    const [tenant, tenantLoading] = useTenant();
    const { data, status } = useSession();
    const [setting, loadingSettings] = useSetting();
    const { user } = data ?? {};
    const [warehouseList, warehouseLoading] = useWarehouses();

    const warehouses = useMemo(() => {
        if (warehouseList && setting && setting?.warehouseId) {
            const id = setting?.warehouseId;
            const index = warehouseList?.findIndex((w) => w.id === id);
            const list = [...warehouseList];
            const el = list.splice(index, 1);
            return [el[0], ...list];
        }
        return warehouseList;
    }, [setting?.warehouseId, warehouseList]);

    return { data: { tenant, user, warehouses, setting }, isLoading: status !== "authenticated" || tenantLoading || warehouseLoading || loadingSettings }
}

type CreateAdjustmentProps = ReturnType<typeof useCreateAdjustmentRequiredData>['data'];

export function CreateAdjustment({ tenant, user, warehouses, setting }: CreateAdjustmentProps) {

    const options = useMemo((): ZodFormFieldOptions => (
        {
            warehouseId: {
                label: "Warehouse",
                ordering: 1,
                options: warehouses?.map((v) => ({ label: v.name, value: v.id })) ?? []
            },
            date: {
                label: "Date",
                ordering: 2
            },
            ref: {
                label: "reference", ordering: 3,
                hidden: true
            },
            notes: {
                label: "Notes",
                textArea: true,
                ordering: 4
            },
            items: {
                hidden: true
            },
            userId: {
                hidden: true
            },
            tenantId: {
                hidden: true
            },
            "adjustmentDetails.0.productId": {
                hidden: true
            },
            "adjustmentDetails.0.productVariantId": {
                hidden: true
            },
            "adjustmentDetails.0.quantity": {
                label: ""
            },
            "adjustmentDetails.0.type": {
                label: "",
                options: [
                    "Addition", "Subtraction"
                ]
            }

        }
    ), [warehouses]);

    const [config, form] = useZodForm(createAdjustmentInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, items: 0 }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const fname = useFieldArrayName(fieldArrayConfig);

    const adjustmentDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.adjustment.create.useMutation();
    const details = form.watch("adjustmentDetails")
    useMemo(() => {
        console.log("adjustment details changed");
        form.setValue(Prisma.AdjustmentScalarFieldEnum.items, adjustmentDetailsForm.fields.length)
    }, [details]);
    useEffect(() => {
        form.setValue(Prisma.AdjustmentScalarFieldEnum.date, new Date())
        form.setValue(Prisma.AdjustmentScalarFieldEnum.ref, Date.now().toString())
        //   form.setValue(Prisma.AdjustmentScalarFieldEnum.userId,Date.now().toLocaleString())

    }, [])
    const errors = form.formState.errors;

    const detailsData = useMemo(() => adjustmentDetailsForm.fields.map((item, i) => {
        return {
            fields: renderFieldArrayForm({
                config: fieldArrayConfig,
                errors, index: i,
                key: item.key,
                register: form.register,
                name: fname
            }), ...item
        }
    }), [adjustmentDetailsForm.fields, errors, fname, form.register]);
    
    const { notesField, otherFields } = useMemo(() => {
        let notesField;
        const otherFields: ZodFormFieldConfig[] = []
        for (let f of regularConfig) {
            if (f.name === Prisma.AdjustmentScalarFieldEnum.notes) {
                notesField = f;
            } else {
                otherFields.push(f)
            }
        }
        return { notesField, otherFields }
    }, []);

    
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
                        keyPath={(data) => `${data.name}-${data.variantName}`}
                         displayValuePath={(v) =>  `${v.name}${v.variantName ? ` - ${v.variantName}` : ""}`}
                        onChange={(e, reset) => {
                            const v = e.target.value;
                            //console.log(v)
                            adjustmentDetailsForm.append({
                                productId: v.id,
                                productVariantId: v.variantId,
                                type: "Addition",
                                displayName: `${v.name}${v.variantName ? ` - ${v.variantName}` : ""}`,
                                quantity: 1
                            });
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
                            accessor: "code",
                            disableSortBy: true
                        },
                        {
                            Header: "Product",
                            accessor: "displayName"
                            ,
                            disableSortBy: true
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
                            accessor: "fields.0",
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
                            Cell:({row}:{row:any})=>{
                           return <button onClick={()=>adjustmentDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
        <CollectRequiredDataWrapper useHooks={useCreateAdjustmentRequiredData}>
            {(props) => <CreateAdjustment {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;



function ProductCombobox() {

    const [products, result, labels, setSearchText] = useProductSearch();
    return (<div className="flex flex-col gap-2">
        <input type="text" onChange={(e) => {
            setSearchText(e.target.value);
        }} className="input input-bordered m-4 input-primary"></input>
        <div className="flex flex-col gap-2">
            {labels.map((v) => {
                const name = `${v.name}${v.variantName ? `-${v.variantName}` : ""}`
                return (<span key={name}>{name}</span>)
            }
            )}
        </div>
    </div>)
}

export function useProductSearch<T extends z.infer<typeof ProductFindManySchema> = z.infer<typeof ProductFindManySchema>>
    (take: number = 5) {
    const trpc = useTrpcTenant();
    const [products, setProducts] = useState<(Product & {
        brand: Brand | null;
        category: Category;
        productUnit: Unit | null;
        productPurchaseUnit: Unit | null;
        productsSaleUnit: Unit | null;
        productVariants: ProductVariant[];
    })[]>([]);

    const [text, setSearchText] = useState("");
    const [query, setQuery] = useState<T>({ take: 0 } as T)

    const labels = useMemo(() => {
        //TODO provide a way to format this result
        let list: { name: string, id: number, variantId?: number, variantName?: string }[] = []
        if (products)
            for (let item of products) {
                if (item.isVariant) {
                    for (let v of item.productVariants) {
                        list.push({ name: item.name, id: item.id, variantName: v.name!, variantId: v.id })
                    }
                } else {
                    list.push({ name: item.name, id: item.id })
                }
            }
        return list;
    }, [products])

    const [dText] = useDebounce(text, 1000,);

    useEffect(() => {
        console.log("query should excute now");

        setQuery((dText && dText.length ? {
            take: take,
            where: {
                OR: [
                    {
                        name: {
                            contains: dText,
                            mode: Prisma.QueryMode.insensitive
                        }
                    },
                    {
                        code: {
                            startsWith: dText,
                            mode: Prisma.QueryMode.insensitive
                        }
                    },
                    {
                        productVariants: {
                            some: {
                                name: {
                                    contains: dText,
                                    mode: Prisma.QueryMode.insensitive

                                }
                            }
                        }
                    }
                ]
            }
        } : { take: 0 }) as T)

    }, [dText])

    const result = trpc.product.search.useQuery(query, {
        onSuccess: (data) => {
            setProducts(data);
        }
    })

    return [products, result, labels, setSearchText] as [typeof products, typeof result, typeof labels, typeof setSearchText]
}












function useCustomerSearch(where: z.infer<typeof CustomerFindManySchema>) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.people.search.useQuery(where, {
        onSuccess: (data) => {
            setCustomers(data);
        }
    })
    return [customers, result.isLoading, result.refetch] as [typeof customers, boolean, typeof result.refetch]
}

function useBrandsSearch(where: z.infer<typeof BrandFindManySchema>) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.product.brand.search.useQuery(where, {
        onSuccess: (data) => {
            setBrands(data);
        }
    })
    return [brands, result.isLoading, result.refetch] as [typeof brands, boolean, typeof result.refetch]
}

function useCategorySearch(where: z.infer<typeof CategoryFindManySchema>) {
    const [categories, setCategoriess] = useState<Category[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.product.category.search.useQuery(where, {
        onSuccess: (data) => {
            setCategoriess(data);
        }
    })
    return [categories, result.isLoading, result.refetch] as [typeof categories, boolean, typeof result.refetch]
}