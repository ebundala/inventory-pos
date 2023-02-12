import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updatePurchaseReturnInputSchema } from "@/core/purchase_return/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { usePurchaseReturn } from "@/lib/hooks/usePurchaseReturn";
import { useEffect, useMemo } from 'react';
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { PaymentPurchaseReturn, Prisma, Product, ProductVariant, ProductWarehouse, PurchaseReturnDetail, Unit } from "@prisma/client";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useProductSearch, productToPurchaseReturnDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { usePurchaseReturnFormFieldOptions } from "@/lib/hooks/usePurchaseReturnFormFieldOptions";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { usePurchaseReturnConstraints } from "@/lib/hooks/usePurchaseReturnConstraints";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";

interface PurchaseReturnPathProps extends ParsedUrlQuery {
    purchaseReturnId: string;
}
export function UpdatePurchaseReturn({tenant,purchaseReturn,defaultCurrency,refetch}:PurchaseReturnRequiredDataReturnType['data']) {
    
    const symbol = defaultCurrency?.symbol ?? "";
    
    const options = usePurchaseReturnFormFieldOptions(purchaseReturn as any);

    const [config, form] = useZodForm(updatePurchaseReturnInputSchema, options, {
        defaultValues: { ...(purchaseReturn??{}) }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const groupedFieldArray = useGroupedFieldArray(fieldArrayConfig);

    const purchaseReturnDetailFieldConfig = groupedFieldArray.get('purchaseReturnDetails');
    const paymentPurchaseReturnFieldConfig = groupedFieldArray.get('paymentPurchaseReturns')
    const purchaseReturnDetailFormName = useFieldArrayName(purchaseReturnDetailFieldConfig!);
    const paymentPurchaseReturnFormName = useFieldArrayName(paymentPurchaseReturnFieldConfig!);

    const purchaseReturnDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: purchaseReturnDetailFormName });
    const paymentPurchaseReturnsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: paymentPurchaseReturnFormName });

    const trpcWithHost = useTrpcTenant();
    const {showProgress,callbacks} = useProgressFeedback("/purchase-returns")

    const result = trpcWithHost.purchase_return.update.useMutation({
        onSuccess:(data, variables, context) =>{
          callbacks.onSuccess(data)
           refetch()
        },
        onError:callbacks.onError
    });



    useEffect(() => {
        if(purchaseReturn){
         form.reset(purchaseReturn);
        }      
    }, [purchaseReturn])

    const detailsData = useRenderFieldArrayForm(purchaseReturnDetailFormName, purchaseReturnDetailsForm, form, purchaseReturnDetailFieldConfig!)
    const purchaseReturnsData = useRenderFieldArrayForm(paymentPurchaseReturnFormName, paymentPurchaseReturnsForm, form, paymentPurchaseReturnFieldConfig!)


    const [notesField, fields] = useGetZodFormField(Prisma.PurchaseReturnScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.PurchaseReturnScalarFieldEnum.date,
        Prisma.PurchaseReturnScalarFieldEnum.warehouseId,
        Prisma.PurchaseReturnScalarFieldEnum.supplierId], fields)
        const [paidAmountField, fields3] = useGetZodFormField(Prisma.PurchaseReturnScalarFieldEnum.paidAmount, fields2);

    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.PurchaseReturnScalarFieldEnum.taxRate,
        Prisma.PurchaseReturnScalarFieldEnum.discount,
        Prisma.PurchaseReturnScalarFieldEnum.shipping,
        Prisma.PurchaseReturnScalarFieldEnum.status,
        Prisma.PurchaseReturnScalarFieldEnum.paymentStatus,
    ], fields3)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = 'purchaseReturnDetails';
            const paymentPath = "paymentPurchaseReturns";

            let grandTotal = 0, subTotal = 0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath], data);
                const paymentPurchaseReturns = getValue([paymentPath], data)
              
                let taxRate = getValue([Prisma.PurchaseReturnScalarFieldEnum.taxRate], data);
                let discount = getValue([Prisma.PurchaseReturnScalarFieldEnum.discount], data);
                let shipping = getValue([Prisma.PurchaseReturnScalarFieldEnum.shipping], data);
                let paidAmount = getValue([Prisma.PurchaseReturnScalarFieldEnum.paidAmount], data);

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<PurchaseReturnDetail & {
                                product: Product & {
                                    productUnit?: Unit,
                                    productPurchaseUnit?: Unit,
                                    productsSaleUnit?: Unit
                                }, productVariant?: ProductVariant
                            }>;
                            //Compute all computed fields and batch update the form 

                            // Todo add tax rate per product to calcurate taxNet per product
                            const productTaxRate = getValue([Prisma.ProductScalarFieldEnum.taxNet],detail.product);
                            const productPrice = getValue([Prisma.ProductScalarFieldEnum.price],detail.product);

                            const productTaxMethod = detail.product?.taxMethod ?? "inclusive";
                            const productTaxMethodAction = (productTaxMethod === "inclusive" ? -1 : 0);

                            // Todo compute quantity based on units and its parent;
                            const productQuantity = getValue([Prisma.PurchaseDetailScalarFieldEnum.quantity],detail);
                            const productDiscount = getValue([Prisma.PurchaseDetailScalarFieldEnum.discount],detail);
                            const saleUnitId = detail.product?.unitSaleId;
                            const stockUnitId = detail.product?.unitId;
                            const taxValue = (productTaxRate / 100 * productPrice);
                            const productPriceBeforeTax = productPrice + (taxValue * productTaxMethodAction)
                            const productTaxNet = taxValue * productQuantity



                            const productSubTotal = productQuantity * productPriceBeforeTax + productTaxNet - productDiscount;
                            subTotal += productSubTotal;
                            
                            partialData.push(...[
                                { value: productQuantity, default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.cost] },
                                { value: productTaxNet, default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [detailsPath, i, Prisma.PurchaseDetailScalarFieldEnum.discountMethod] }
                            ])
                        }
                    }
                    taxNet = (subTotal - discount) * (taxRate / 100);
                    grandTotal = (subTotal + taxNet) + shipping;
                    
                    partialData.push(...[
                        { value: taxNet, default: 0, path: [Prisma.PurchaseReturnScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.PurchaseReturnScalarFieldEnum.grandTotal] },
                        { value: discount, default: 0, path: [Prisma.PurchaseReturnScalarFieldEnum.discount] },
                        { value: taxRate, default: 0, path: [Prisma.PurchaseReturnScalarFieldEnum.taxRate] },
                        { value: shipping, default: 0, path: [Prisma.PurchaseReturnScalarFieldEnum.shipping] },

                    ])
                }

                if (paymentPurchaseReturns && paymentPurchaseReturns instanceof Array) {
                    for (let i = 0; i < paymentPurchaseReturns.length; i++) {
                        const item = paymentPurchaseReturns[i];
                        if (item) {
                            let payment = item as PaymentPurchaseReturn;
                            const amount = getValue([Prisma.PaymentPurchaseReturnScalarFieldEnum.amount], payment)
                            let change = amount;
                            if (amount > paidAmount) {
                                change = amount - paidAmount;
                            } else {
                                change = 0;
                            }
                            partialData.push(
                                ...[
                                    { value: change, default: 0, path: [paymentPath, i, Prisma.PaymentSaleScalarFieldEnum.change] },

                                ]
                            )

                        }
                    }
                }
            }
            return partialData;
        }
    })
useSetComputedValues(form,data);
    // useEffect(() => {
    //     // console.log(data);
    //     const values = form.getValues();
    //     for (let v of data) {
    //         if (getValue(['value'], v) !== getValue(v.path, values)) {
    //             console.log("changed ", v.value, getValue(v.path, values))
    //             form.setValue(v.path.join('.'), v.value);
    //         }
    //     }
    // }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal] = form.watch([
        Prisma.PurchaseReturnScalarFieldEnum.taxRate,
        Prisma.PurchaseReturnScalarFieldEnum.taxNet,
        Prisma.PurchaseReturnScalarFieldEnum.discount,
        Prisma.PurchaseReturnScalarFieldEnum.shipping,
        Prisma.PurchaseReturnScalarFieldEnum.grandTotal])
        const [paymentStatus,warehouseId] = form.watch([Prisma.SaleScalarFieldEnum.paymentStatus,
            Prisma.SaleScalarFieldEnum.warehouseId]);
            
        const paymentFields = useMemo(() => {
            if (paymentStatus === "Paid") {
                form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal);
            }
    
            if (paymentStatus === "Pending") {
                if (paymentPurchaseReturnsForm.fields.length > 0) {
                    paymentPurchaseReturnsForm.replace([])
                }
            } else if (paymentStatus && paymentPurchaseReturnsForm.fields.length == 0 && purchaseReturnsData.length == 0) {
                const date = new Date();
                const ref = Date.now();
                const amount = paymentStatus === "Partial" ? 0 : grandTotal;
    
                paymentPurchaseReturnsForm.replace([{ date: date, ref: `${ref}`, amount: amount, change: 0, id:-1}]);
    
            }
            else if (paymentPurchaseReturnsForm.fields.length > 0 && purchaseReturnsData.length > 0) {
                const props = { ...paidAmountField!, props: { ...paidAmountField!.props, disabled: paymentStatus === "Paid" } }
                const paidInput = <FormInputField key={paidAmountField!.name} {...props} />
                return [purchaseReturnsData.at(0)!.fields.slice(0, 2), paidInput, ...purchaseReturnsData.at(0)!.fields!.slice(2)]
            }
            return [];
        }, [paymentStatus, paymentPurchaseReturnsForm.fields.length, purchaseReturnsData.length])
    
        useEffect(() => {
            if (paymentStatus === "Paid") {
                form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal);
            }
        }, [grandTotal, paymentStatus]);

        const checkDuplicates = useEnforceUniqueProduct(purchaseReturnDetailsForm as any);
        const constraints = usePurchaseReturnConstraints(form.control);
        useSetComputedValues(form,constraints);
        
    return (
        <FormContainer title={<h2>Update Purchase Return</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                showProgress({animated:true})
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
                                    format: productToPurchaseReturnDetailFormater,
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
                                const detail = row.original as PurchaseReturnDetail & {
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
                                return <button onClick={() => purchaseReturnDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
                    {purchaseReturnsData.length > 0 && paymentFields}

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
        <CollectRequiredDataWrapper useHooks={usePurchaseReturnRequiredData}>
            {(props)=>{
                return <UpdatePurchaseReturn {...props}/>
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function usePurchaseReturnRequiredData() {
    const router = useRouter();
    const purchaseReturnId = parseInt((router.query as PurchaseReturnPathProps).purchaseReturnId ?? "");
    const {purchaseReturn, result:{isLoading:loading,}, refetch} = usePurchaseReturn(purchaseReturnId);
    const {tenant, result:{isLoading:tenantLoading}} = useTenant();    
    const {setting, result:{isLoading:settingLoading}} = useSetting(); 
    return {data:{ tenant,setting,defaultCurrency:setting?.currency ,purchaseReturn,refetch },isLoading: tenantLoading || loading || settingLoading};
}
type PurchaseReturnRequiredDataReturnType = ReturnType<typeof usePurchaseReturnRequiredData>