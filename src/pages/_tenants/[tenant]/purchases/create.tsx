import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createPurchaseInputSchema } from "@/core/purchase/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { PaymentPurchase, Prisma, Product, ProductVariant, ProductWarehouse, PurchaseDetail, Unit } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch, productToPurchaseDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { OrderSummary } from "@/components/OrderSummary";
import { usePurchaseFormFieldOptions } from "@/lib/hooks/usePurchaseFormFieldOptions";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";


export function CreatePurchase({ tenant, defaultWarehouse, user, setting, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";
    
    const options = usePurchaseFormFieldOptions();

    const [config, form] = useZodForm(createPurchaseInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const groupedFieldArray = useGroupedFieldArray(fieldArrayConfig);

    const purchaseDetailFieldConfig = groupedFieldArray.get('purchaseDetails');
    const paymentPurchaseFieldConfig = groupedFieldArray.get('paymentPurchases')
   
    const purchaseDetailFormName = useFieldArrayName(purchaseDetailFieldConfig!);
    const paymentPurchasesFormName = useFieldArrayName(paymentPurchaseFieldConfig!);

    const purchaseDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: purchaseDetailFormName });
    const paymentPurchasesForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: paymentPurchasesFormName });

    const trpcWithHost = useTrpcTenant();
    const {showProgress,callbacks} = useProgressFeedback("/purchases")

    const result = trpcWithHost.purchase.create.useMutation(callbacks);



    useEffect(() => {
        form.setValue(Prisma.PurchaseScalarFieldEnum.date, new Date())
        form.setValue(Prisma.PurchaseScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.PurchaseScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.PurchaseScalarFieldEnum.discount, 0)
        form.setValue(Prisma.PurchaseScalarFieldEnum.shipping, 0)
        form.setValue(Prisma.PurchaseScalarFieldEnum.paidAmount, 0)
    }, [])

    const detailsData = useRenderFieldArrayForm(purchaseDetailFormName, purchaseDetailsForm, form, purchaseDetailFieldConfig!)
    const paymentPurchaseData = useRenderFieldArrayForm(paymentPurchasesFormName, paymentPurchasesForm, form, paymentPurchaseFieldConfig!)


    const [notesField, fields] = useGetZodFormField(Prisma.PurchaseScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.PurchaseScalarFieldEnum.date,
        Prisma.PurchaseScalarFieldEnum.warehouseId,
        Prisma.PurchaseScalarFieldEnum.supplierId], fields)
        const [paidAmountField, fields3] = useGetZodFormField(Prisma.PurchaseScalarFieldEnum.paidAmount, fields2);

    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.PurchaseScalarFieldEnum.taxRate,
        Prisma.PurchaseScalarFieldEnum.discount,
        Prisma.PurchaseScalarFieldEnum.shipping,
        Prisma.PurchaseScalarFieldEnum.status,
        Prisma.PurchaseScalarFieldEnum.paymentStatus,
    ], fields3)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = 'purchaseDetails';
            const paymentPath = "paymentSales";

            let grandTotal = 0, subTotal = 0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath], data);
                const paymentPurchases = getValue([paymentPath], data)
              
                let taxRate = getValue([Prisma.PurchaseScalarFieldEnum.taxRate], data);
                let discount = getValue([Prisma.PurchaseScalarFieldEnum.discount], data);
                let shipping = getValue([Prisma.PurchaseScalarFieldEnum.shipping], data);
                let paidAmount = getValue([Prisma.PurchaseScalarFieldEnum.paidAmount], data);

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<PurchaseDetail & {
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
                        { value: taxNet, default: 0, path: [Prisma.PurchaseScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.PurchaseScalarFieldEnum.grandTotal] },
                        { value: discount, default: 0, path: [Prisma.PurchaseScalarFieldEnum.discount] },
                        { value: taxRate, default: 0, path: [Prisma.PurchaseScalarFieldEnum.taxRate] },
                        { value: shipping, default: 0, path: [Prisma.PurchaseScalarFieldEnum.shipping] },

                    ])
                }

                if (paymentPurchases && paymentPurchases instanceof Array) {
                    for (let i = 0; i < paymentPurchases.length; i++) {
                        const item = paymentPurchases[i];
                        if (item) {
                            let payment = item as PaymentPurchase;
                            const amount = getValue([Prisma.PaymentPurchaseScalarFieldEnum.amount], payment)
                            let change = amount;
                            if (amount > paidAmount) {
                                change = amount - paidAmount;
                            } else {
                                change = 0;
                            }
                            partialData.push(
                                ...[
                                    { value: change, default: 0, path: [paymentPath, i, Prisma.PaymentSaleScalarFieldEnum.change] },
                                   // { value: paidAmount, default: 0, path: [paymentPath, i, Prisma.PaymentSaleScalarFieldEnum.amount] }
                                ]
                            )

                        }
                    }
                }
            }
            return partialData;
        }
    })

    useEffect(() => {
        // console.log(data);
        const values = form.getValues();
        for (let v of data) {
            if (getValue(['value'], v) !== getValue(v.path, values)) {
                console.log("changed ", v.value, getValue(v.path, values))
                form.setValue(v.path.join('.'), v.value);
            }
        }
    }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal] = form.watch([
        Prisma.PurchaseScalarFieldEnum.taxRate,
        Prisma.PurchaseScalarFieldEnum.taxNet,
        Prisma.PurchaseScalarFieldEnum.discount,
        Prisma.PurchaseScalarFieldEnum.shipping,
        Prisma.PurchaseScalarFieldEnum.grandTotal])
        const [paymentStatus,warehouseId] = form.watch([Prisma.SaleScalarFieldEnum.paymentStatus,Prisma.SaleScalarFieldEnum.warehouseId]);
        const paymentFields = useMemo(() => {
            if (paymentStatus === "Paid") {
                form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal);
            }
    
            if (paymentStatus === "Pending") {
                if (paymentPurchasesForm.fields.length > 0) {
                    paymentPurchasesForm.replace([])
                }
            } else if (paymentStatus && paymentPurchasesForm.fields.length == 0 && paymentPurchaseData.length == 0) {
                const date = new Date();
                const ref = Date.now();
                const amount = paymentStatus === "Partial" ? 0 : grandTotal;
    
                paymentPurchasesForm.replace([{ date: date, ref: `${ref}`, amount: amount, change: 0, id:-1}]);
    
            }
            else if (paymentPurchasesForm.fields.length > 0 && paymentPurchaseData.length > 0) {
                const props = { ...paidAmountField!, props: { ...paidAmountField!.props, disabled: paymentStatus === "Paid" } }
                const paidInput = <FormInputField key={paidAmountField!.name} {...props} />
                return [paymentPurchaseData.at(0)!.fields.slice(0, 2), paidInput, ...paymentPurchaseData.at(0)!.fields!.slice(2)]
            }
            return [];
        }, [paymentStatus, paymentPurchasesForm.fields.length, paymentPurchaseData.length])
    
        useEffect(() => {
            if (paymentStatus === "Paid") {
                form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal);
            }
        }, [grandTotal, paymentStatus]);

        const checkDuplicates = useEnforceUniqueProduct(purchaseDetailsForm as any);

    return (
        <FormContainer title={<h2>Create Purchase</h2>}>
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
                            //console.log(v)
                            checkDuplicates(v as any);
                            if (reset) {
                                reset();
                            }

                        }}
                        useGetDataHook={() => {
                            const { labels, data, ...rest } = useProductSearch(
                                {
                                    format: productToPurchaseDetailFormater,
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
                            accessor: "product.productWarehouse",
                            disableSortBy: true,
                            Cell: ({
                                row,
                                value,
                              }: {
                                value: ProductWarehouse[];
                                row: any;
                              }) => {
                                const detail = row.original as PurchaseDetail & {
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
                                return <button onClick={() => purchaseDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
                    {paymentPurchaseData.length > 0 && paymentFields}

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
            {(props) => <CreatePurchase {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;



