import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createQuotationInputSchema } from "@/core/quotation/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm, ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray, useWatch } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Prisma, Product, ProductVariant, QuotationDetail, Unit } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
//import { useQuotationFormFieldOptions } from "@/lib/hooks/useQuotationFormFieldOptions";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch, productToQuotationDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { useGetZodFormField, useGetZodFormFields } from "@/lib/hooks/useGetZodFormField";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useDefaultCustomer } from '@/lib/hooks/useDefaultCustomer';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";



export function CreateQuotation({ tenant, user, units, warehouses, setting, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";
    const [defaultCustomer, customerLoading] = useDefaultCustomer(setting!.customerId!);
    const options = useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            // options:(warehouses??[]).map((v)=>({label:v.name,value:v.id})),
            combobox: {
                elevation:30,
                value:warehouses?warehouses[0]:undefined,
                valuePath:"id",
                displayValuePath:"name",
                useGetDataHook: () => {
                    const [_, result, labels, setSearchText, dtext] = useWarehouseSearch();
                    return [labels, setSearchText, result.isLoading, dtext]

                }
            }
        },

        customerId: {
            label: "Customer",
            ordering: 3,
            // options:defaultCustomer?[{label:defaultCustomer!.name,value:defaultCustomer!.id}]:[]
            combobox: {
                elevation:30,
                value:defaultCustomer??undefined,
                valuePath:"id",
                displayValuePath:"name",
                useGetDataHook: () => {
                    const [_, result, labels, setSearchText, dtext] = useCustomerSearch();
                    return [labels, setSearchText, result.isLoading, dtext]

                }
            }

        },

        taxRate: {
            label: "Tax (%)",
            ordering: 4
        },

        discount: {
            label: "Discount",
            ordering: 5
        },
        shipping: {
            label: "Shipping",
            ordering: 6
        },

        status: {
            label: "Status",
            ordering: 7,
            options: [
                "Pending", "Sent"
            ]
        },
        notes: {
            label: "Notes",
            textArea: true,
            ordering: 8
        },
        ref: {
            label: "Reference",
            hidden: true,
            ordering: 9
        },
        taxNet: {
            label: `Tax total (${symbol})`,
            hidden: true,
            ordering: 10,
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11
        },
        userId: {
            hidden: true
        },
        tenantId: {
            hidden: true
        },
        "quotationDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "quotationDetails.0.price": {
            label: "Unit Price",
            hideLabel: true,
            readonly: true,
            ordering: 14,
            //hidden: true

        },
        "quotationDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,

        },
        "quotationDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true
        },
        "quotationDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: true,
            ordering: 17
        },
        "quotationDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: true,
            ordering: 18
        },

        "quotationDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },


        "quotationDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "quotationDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },


        "quotationDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30

        },

        "quotationDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27

        },





    }), [customerLoading, defaultCustomer, warehouses])

    const [config, form] = useZodForm(createQuotationInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const fname = useFieldArrayName(fieldArrayConfig);

    const quotationDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: fname });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.quotation.create.useMutation();



    useEffect(() => {
        form.setValue(Prisma.QuotationScalarFieldEnum.date, new Date())
        form.setValue(Prisma.QuotationScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.QuotationScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.QuotationScalarFieldEnum.discount, 0)
        form.setValue(Prisma.QuotationScalarFieldEnum.shipping, 0)

    }, [])

    const detailsData = useRenderFieldArrayForm(fname, quotationDetailsForm, form, fieldArrayConfig)


    const [notesField, fields] = useGetZodFormField(Prisma.QuotationScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.QuotationScalarFieldEnum.date,
        Prisma.QuotationScalarFieldEnum.warehouseId,
        Prisma.QuotationScalarFieldEnum.customerId], fields)

    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.QuotationScalarFieldEnum.taxRate,
        Prisma.QuotationScalarFieldEnum.discount,
        Prisma.QuotationScalarFieldEnum.shipping,
        Prisma.QuotationScalarFieldEnum.status,
    ], fields2)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const rootPath = 'quotationDetails';
            let taxRate = 0, discount = 0, shipping = 0, grandTotal = 0, subTotal = 0, taxNet = 0;

            if (data) {
                const details = data[rootPath];
                taxRate = data[Prisma.QuotationScalarFieldEnum.taxRate] ?? 0;
                discount = data[Prisma.QuotationScalarFieldEnum.discount] ?? 0;
                shipping = data[Prisma.QuotationScalarFieldEnum.shipping] ?? 0;

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<QuotationDetail & {
                                product: Product & {
                                    productUnit?: Unit,
                                    productPurchaseUnit?: Unit,
                                    productsSaleUnit?: Unit
                                }, productVariant?: ProductVariant
                            }>;
                            //Compute all computed fields and batch update the form 

                            // Todo add tax rate per product to calcurate taxNet per product
                            const productTaxRate = (detail.product?.taxNet ?? 0);

                            const productTaxMethod = detail.product?.taxMethod ?? "inclusive";
                            const productTaxMethodAction = (productTaxMethod === "inclusive" ? -1 : 0);

                            // Todo compute quantity based on units and its parent;
                            const productQuantity = (detail.quantity ?? 0);
                            const productDiscount = (detail.discount ?? 0);
                            const saleUnitId = detail.product?.unitSaleId;
                            const stockUnitId = detail.product?.unitId;
                            const productPrice = (detail.product?.price ?? 0);
                            const taxValue = (productTaxRate / 100 * productPrice);
                            const productPriceBeforeTax = productPrice + (taxValue * productTaxMethodAction)
                            const productTaxNet = taxValue * productQuantity



                            const productSubTotal = productQuantity * productPriceBeforeTax + productTaxNet - productDiscount;
                            subTotal += productSubTotal;
                            console.log(productPriceBeforeTax)
                            partialData.push(...[
                                { value: productQuantity, default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.price] },
                                { value: productTaxNet, default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [rootPath, i, Prisma.QuotationDetailScalarFieldEnum.discountMethod] }
                            ])
                        }
                    }
                    taxNet = (subTotal - discount) * (taxRate / 100);
                    grandTotal = (subTotal + taxNet) + shipping;
                    partialData.push(...[
                        { value: taxNet, default: 0, path: [Prisma.QuotationScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.QuotationScalarFieldEnum.grandTotal] },
                        { value: discount, default: 0, path: [Prisma.QuotationScalarFieldEnum.discount] },
                        { value: taxRate, default: 0, path: [Prisma.QuotationScalarFieldEnum.taxRate] },
                        { value: shipping, default: 0, path: [Prisma.QuotationScalarFieldEnum.shipping] },

                    ])
                }
            }
            return partialData;
        }
    })

    useMemo(() => {
        // console.log(data);
        const values = form.getValues();
        for (let v of data) {
            // Todo find better way to detect changes 
            if (v.value !== getValue(v.path, values)) {
                // console.log("changed ",v.value,getValue(v.path,values))
                if (!v.value) {
                    form.setValue(v.path.join('.'), v.default);
                } else {
                    form.setValue(v.path.join('.'), v.value);

                }
            }
        }
    }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal] = form.watch([
        Prisma.QuotationScalarFieldEnum.taxRate,
        Prisma.QuotationScalarFieldEnum.taxNet,
        Prisma.QuotationScalarFieldEnum.discount,
        Prisma.QuotationScalarFieldEnum.shipping,
        Prisma.QuotationScalarFieldEnum.grandTotal])

    return (
        <FormContainer title={<h2>Create Quotation</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                console.log(data);
                await result.mutateAsync(data as any);
                form.reset();

            }, (e) => {
                console.error(e);
            })}>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {mainFields.map((i) => {


                        return (<FormInputField key={i.name} {...i} />);
                    })}

                </div>
                <div className="w-full">
                    <FormComboBox
                        label="Search products by name/Scan barcode"
                        hideValue={true}
                        keyPath={(v) => getProductFormatedName(v as any)}
                        displayValuePath={(v) => getProductFormatedName(v as any)}
                        onChange={(e, reset) => {
                            const v = e.target.value;
                            //console.log(v)
                            quotationDetailsForm.append(v);
                            if (reset) {
                                reset();

                            }

                        }}
                        useGetDataHook={() => {
                            const [_, result, labels, setSearchText, dtext] = useProductSearch(
                                {
                                    format: productToQuotationDetailFormater,
                                    queryBuilder: productDefaultQueryBuilder,
                                } as any
                            )
                            return [labels, setSearchText, result.isLoading, dtext]
                        }}

                    // props={{ type: "text", hidden: false, disabled: false, }}
                    />
                </div>

                <div className="w-full  ">
                    <CustomTable rowsData={detailsData} collumsData={() => [
                        {
                            Header: "code",
                            accessor: "product.code",
                            disableSortBy: true
                        },
                        {
                            Header: "Product",
                            accessor: "productId",
                            disableSortBy: true,
                            Cell: ({ row }: { row: any }) => {
                                return (
                                    <span className="text text-elipsis w-[150px]">
                                        {getProductFormatedName(row.original)}
                                    </span>);
                            }
                        },
                        {
                            Header: `Unit price (${symbol})`,
                            accessor: "fields.1",
                            disableSortBy: true,

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
                        // {
                        //     Header: `Discount (${symbol})`,
                        //     accessor: "fields.3",
                        //     disableSortBy: true
                        // },
                        {
                            Header: `Tax (${symbol})`,
                            accessor: "fields.4",
                            disableSortBy: true
                        },
                        {
                            Header: `Subtotal (${symbol})`,
                            accessor: "fields.5",
                            disableSortBy: true
                        },
                        {
                            Header: "",
                            accessor: "action",
                            disableSortBy: true,
                            Cell: ({ row }: { row: any }) => {
                                return <button onClick={() => quotationDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
                            }
                        }
                    ]} search={false} pagenation={false} />
                </div>
                <div className="w-full mt-10 flex justify-end">
                    <OrderSummary
                        currency={defaultCurrency?.symbol ?? ""}
                        taxRate={taxRate}
                        tax={taxNet}
                        discount={discount}
                        shipping={shipping}
                        grandTotal={grandTotal}
                    />
                </div>
                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {secondaryFields.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
                    })}

                </div>
                <div className="w-full">
                    <FormInputField  {...notesField as any} />
                </div>

                <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {hiddenFields.map((i) => {
                        return (<FormInputField key={i.name} {...i} />);
                    })}
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
            {(props) => <CreateQuotation {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;

type OrderSummaryProps = {
    tax: number,
    taxRate: number,
    discount: number,
    shipping: number,
    grandTotal: number,
    currency: string,
}
function OrderSummary({ tax, taxRate, discount, shipping, grandTotal, currency }: OrderSummaryProps) {

    return (
        <table className="table table-zebra ">
            <tbody>
                <tr className="hidden"></tr>
                <tr>
                    <td className="font-normal">Order Tax</td> <td><span>{currency} {(tax ? tax : 0).toFixed(2)} ({(taxRate ?? 0).toFixed(2)} %)</span></td>
                </tr>
                <tr>
                    <td className="font-normal">Discount</td> <td>{currency} {(discount ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td className="font-normal">Shipping</td> <td>{currency} {(shipping ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td><span className="font-bold">Grand Total</span></td> <td><span className="font-bold">{currency} {(grandTotal ? grandTotal : 0).toFixed(2)}</span></td>
                </tr>
            </tbody>
        </table>
    );
}
type TComputedFormFieldsResult = { value: any, default: any, path: (string | number)[] }[]
type TComputedFormValuesArgs<TResult extends TComputedFormFieldsResult = TComputedFormFieldsResult, TControl extends any = any, TData extends any = any> = {
    control: TControl,
    defaultValue?: TResult,
    compute: (data: TData) => TResult
}
function useTaxValue({ subTotal, discount, tax }: { subTotal: number, discount: number, tax: number }) {
    return useMemo(() => {
        return ((subTotal - discount) * (tax / 100))
    }, [tax, discount, subTotal]);
}
function useGrandTotal({ subTotal, taxValue, shipping, discount }: { subTotal: number, taxValue: number, shipping: number, discount: number }) {
    return useMemo(() => {
        return subTotal + taxValue + shipping - discount;
    }, [discount, shipping, subTotal, taxValue]);
}

function useComputedZodFormValues({ control, defaultValue, compute }: TComputedFormValuesArgs) {
    const data = useWatch({ control, defaultValue });
    return useMemo(() => {
        return compute(data);
    }, [data])
}