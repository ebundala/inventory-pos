import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createTransferInputSchema } from "@/core/transfer/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Prisma, Product, ProductVariant, ProductWarehouse, TransferDetail, Unit } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch, productToTransferDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { OrderSummary } from "@/components/OrderSummary";
import { useTransferFormFieldOptions } from "@/lib/hooks/useTransferFormFieldOptions";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useTransferConstraints } from "@/lib/hooks/useTransferConstraints";

export function CreateTransfer({ tenant, user, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";

    const options = useTransferFormFieldOptions();

    const [config, form] = useZodForm(createTransferInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)


    const transferDetailsFormName = useFieldArrayName(fieldArrayConfig);

    const transferDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: transferDetailsFormName });

    const trpcWithHost = useTrpcTenant();
    const {showProgress,callbacks} = useProgressFeedback("/transfers")

    const result = trpcWithHost.transfer.create.useMutation(callbacks);



    useEffect(() => {
        form.setValue(Prisma.TransferScalarFieldEnum.date, new Date())
        form.setValue(Prisma.TransferScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.TransferScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.TransferScalarFieldEnum.taxNet, 0)
        form.setValue(Prisma.TransferScalarFieldEnum.discount, 0)
        form.setValue(Prisma.TransferScalarFieldEnum.shipping, 0)

    }, [])

    const detailsData = useRenderFieldArrayForm(transferDetailsFormName, transferDetailsForm, form, fieldArrayConfig)


    const [notesField, fields] = useGetZodFormField(Prisma.TransferScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.TransferScalarFieldEnum.date,
        Prisma.TransferScalarFieldEnum.toWarehouseId,
        Prisma.TransferScalarFieldEnum.fromWarehouseId], fields);

    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.TransferScalarFieldEnum.taxRate,
        Prisma.TransferScalarFieldEnum.discount,
        Prisma.TransferScalarFieldEnum.shipping,
        Prisma.TransferScalarFieldEnum.status,
    ], fields2)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = 'transferDetails';
            let subTotal = 0, grandTotal = 0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath], data);
                let taxRate = getValue([Prisma.TransferScalarFieldEnum.taxRate], data);
                let discount = getValue([Prisma.TransferScalarFieldEnum.discount], data);
                let shipping = getValue([Prisma.TransferScalarFieldEnum.shipping], data);

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<TransferDetail & {
                                product: Product & {
                                    productUnit?: Unit,
                                    productPurchaseUnit?: Unit,
                                    productsTransferUnit?: Unit
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
                            const productPrice = (detail.product?.price ?? 0);
                            const taxValue = (productTaxRate / 100 * productPrice);
                            const productPriceBeforeTax = productPrice + (taxValue * productTaxMethodAction)
                            const productTaxNet = taxValue * productQuantity



                            const productSubTotal = productQuantity * productPriceBeforeTax + productTaxNet - productDiscount;
                            subTotal += productSubTotal;
                            partialData.push(...[
                                { value: productQuantity, default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.cost] },
                                { value: productTaxNet, default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [detailsPath, i, Prisma.TransferDetailScalarFieldEnum.discountMethod] }
                            ])
                        }
                    }
                    taxNet = (subTotal - discount) * (taxRate / 100);
                    grandTotal = (subTotal + taxNet) + shipping;
                    partialData.push(...[
                        { value: taxNet, default: 0, path: [Prisma.TransferScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.TransferScalarFieldEnum.grandTotal] },
                        { value: details.length, default: 0, path: [Prisma.TransferScalarFieldEnum.items] },
                        // { value: taxRate, default: 0, path: [Prisma.TransferScalarFieldEnum.taxRate] },
                        // { value: shipping, default: 0, path: [Prisma.TransferScalarFieldEnum.shipping] },

                    ])
                }



            }
            return partialData;
        }
    })
useSetComputedValues(form,data);
    // useMemo(() => {
       
    //     const values = form.getValues();
    //     for (let v of data) {
    //         if (getValue(['value'], v) !== getValue(v.path, values)) {
    //             console.log("changed ", v.value, getValue(v.path, values))
    //             form.setValue(v.path.join('.'), v.value);
    //         }
    //     }
    // }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal,warehouseId] = form.watch([
        Prisma.TransferScalarFieldEnum.taxRate,
        Prisma.TransferScalarFieldEnum.taxNet,
        Prisma.TransferScalarFieldEnum.discount,
        Prisma.TransferScalarFieldEnum.shipping,
        Prisma.TransferScalarFieldEnum.grandTotal,
        Prisma.TransferScalarFieldEnum.fromWarehouseId]);

    const checkDuplicates = useEnforceUniqueProduct(transferDetailsForm as any)
    const constraints = useTransferConstraints(form.control);
    useSetComputedValues(form,constraints);
    return (
        <FormContainer title={<h2>Create Transfer</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                showProgress({animated:true});
                await result.mutateAsync(data as any);
               
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
                        control={form.control}
                        keyPath={(v) => getProductFormatedName(v as any)}
                        displayValuePath={(v) => getProductFormatedName(v as any)}
                        onChange={(e, reset) => {
                            const v = e.target.value;                        
                           checkDuplicates(v as any);
                            if (reset) {
                                reset();
                            }

                        }}
                        useGetDataHook={() => {
                            const { labels, data, ...rest } = useProductSearch(
                                {
                                    format: productToTransferDetailFormater,
                                    queryBuilder: productDefaultQueryBuilder,
                                } as any
                            );

                            return { data: labels, ...rest }
                        }}

                    // props={{ type: "text", hidden: false, disabled: false, }}
                    />
                </div>

                <div className="w-full  ">
                    <CustomTable 
                    colDeps={[warehouseId]}
                    rowsData={detailsData}
                     collumsData={() => [
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
                                    <div className="w-[160px] whitespace-normal text-ellipsis break-words">
                                        {getProductFormatedName(row.original)}
                                    </div>);
                            }
                        },
                        {
                            Header: `Unit price (${symbol})`,
                            accessor: "fields.1",
                            disableSortBy: true,


                        },
                        {
                            Header: "Stock",
                            accessor: "product.productWarehouse",
                            disableSortBy: true,
                            Cell: ({
                                row,
                                value,
                              }: {
                                value: ProductWarehouse[];
                                row: any;
                              }) => {
                                const detail = row.original as TransferDetail & {
                                  product: Product;
                                  productVariant?: ProductVariant;
                                };
              
                                if (detail.product?.isVariant === true) {                    
                                  return value
                                    ?.filter(
                                      (v) =>
                                        v.warehouseId === warehouseId &&
                                        v.productVariantId === detail.productVariantId
                                    )
                                    ?.reduce((p, c) => p + c.qty, 0);
                                }
                                return value
                                ?.filter((v) => v.warehouseId === warehouseId)
                                ?.reduce((p, c) => p + c.qty, 0);
                            },
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
                            disableSortBy: true,

                        },
                        {
                            Header: `Subtotal (${symbol})`,
                            accessor: "fields.5",
                            disableSortBy: true,

                        },
                        {
                            Header: "",
                            accessor: "action",
                            disableSortBy: true,
                            Cell: ({ row }: { row: any }) => {
                                return <button onClick={() => transferDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
            {(props) => <CreateTransfer {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;





