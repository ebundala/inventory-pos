import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createSaleReturnInputSchema } from "@/core/sale_return/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { PaymentSaleReturn, Prisma, Product, ProductVariant, ProductWarehouse, SaleDetail, SaleReturnDetail, Unit } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch, productToSaleReturnDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { OrderSummary } from "@/components/OrderSummary";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useSaleReturnFormFieldOptions } from "../../../../lib/hooks/useSaleReturnFormFieldOptions";

export function CreateSaleReturn({ tenant, defaultWarehouse, user, setting, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";

    const options = useSaleReturnFormFieldOptions();

    const [config, form] = useZodForm(createSaleReturnInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const groupedFieldArray = useGroupedFieldArray(fieldArrayConfig);
    const saleReturnDetailsConfig = groupedFieldArray.get("saleReturnDetails")!
    const paymentSaleReturnsConfig = groupedFieldArray.get("paymentSaleReturns")!

    const saleReturnDetailsFormName = useFieldArrayName(saleReturnDetailsConfig);
    const paymentSaleReturnsFormName = useFieldArrayName(paymentSaleReturnsConfig);

    const saleReturnDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: saleReturnDetailsFormName });
    const paymentSaleReturnsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: paymentSaleReturnsFormName });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.sale_return.create.useMutation();



    useEffect(() => {
        form.setValue(Prisma.SaleReturnScalarFieldEnum.date, new Date())
        form.setValue(Prisma.SaleReturnScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.SaleReturnScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.SaleReturnScalarFieldEnum.discount, 0)
        form.setValue(Prisma.SaleReturnScalarFieldEnum.shipping, 0)
        form.setValue(Prisma.SaleReturnScalarFieldEnum.paidAmount, 0)
    }, [])

    const detailsData = useRenderFieldArrayForm(saleReturnDetailsFormName, saleReturnDetailsForm, form, saleReturnDetailsConfig)

    const paymentSaleReturnData = useRenderFieldArrayForm(paymentSaleReturnsFormName, paymentSaleReturnsForm, form, paymentSaleReturnsConfig)

    const [notesField, fields] = useGetZodFormField(Prisma.SaleReturnScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.SaleReturnScalarFieldEnum.date,
        Prisma.SaleReturnScalarFieldEnum.warehouseId,
        Prisma.SaleReturnScalarFieldEnum.clientId], fields)
    const [paidAmountField, fields3] = useGetZodFormField(Prisma.SaleReturnScalarFieldEnum.paidAmount, fields2);
    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.SaleReturnScalarFieldEnum.taxRate,
        Prisma.SaleReturnScalarFieldEnum.discount,
        Prisma.SaleReturnScalarFieldEnum.shipping,
        Prisma.SaleReturnScalarFieldEnum.status,
        Prisma.SaleReturnScalarFieldEnum.paymentStatus,
    ], fields3)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = 'saleReturnDetails';
            const paymentPath = "paymentSaleReturns";
            let subTotal = 0, grandTotal = 0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath], data);
                const paymentSaleReturns = getValue([paymentPath], data)
                let taxRate = getValue([Prisma.SaleReturnScalarFieldEnum.taxRate], data);
                let discount = getValue([Prisma.SaleReturnScalarFieldEnum.discount], data);
                let shipping = getValue([Prisma.SaleReturnScalarFieldEnum.shipping], data);
                let paidAmount = getValue([Prisma.SaleReturnScalarFieldEnum.paidAmount], data);

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<SaleReturnDetail & {
                                product: Product & {
                                    productUnit?: Unit,
                                    productPurchaseUnit?: Unit,
                                    productsSaleReturnUnit?: Unit
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
                            const saleReturnUnitId = detail.product?.unitSaleId;
                            const stockUnitId = detail.product?.unitId;
                            const productPrice = (detail.product?.price ?? 0);
                            const taxValue = (productTaxRate / 100 * productPrice);
                            const productPriceBeforeTax = productPrice + (taxValue * productTaxMethodAction)
                            const productTaxNet = taxValue * productQuantity



                            const productSubTotal = productQuantity * productPriceBeforeTax + productTaxNet - productDiscount;
                            subTotal += productSubTotal;
                            partialData.push(...[
                                { value: productQuantity, default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.price] },
                                { value: productTaxNet, default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [detailsPath, i, Prisma.SaleReturnDetailScalarFieldEnum.discountMethod] }
                            ])
                        }
                    }
                    taxNet = (subTotal - discount) * (taxRate / 100);
                    grandTotal = (subTotal + taxNet) + shipping;
                    partialData.push(...[
                        { value: taxNet, default: 0, path: [Prisma.SaleReturnScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.SaleReturnScalarFieldEnum.grandTotal] },
                        // { value: discount, default: 0, path: [Prisma.SaleReturnScalarFieldEnum.discount] },
                        // { value: taxRate, default: 0, path: [Prisma.SaleReturnScalarFieldEnum.taxRate] },
                        // { value: shipping, default: 0, path: [Prisma.SaleReturnScalarFieldEnum.shipping] },

                    ])
                }

                if (paymentSaleReturns && paymentSaleReturns instanceof Array) {
                    for (let i = 0; i < paymentSaleReturns.length; i++) {
                        const item = paymentSaleReturns[i];
                        if (item) {
                            let payment = item as PaymentSaleReturn;
                            const amount = getValue([Prisma.PaymentSaleReturnScalarFieldEnum.amount], payment)
                            let change = amount;
                            if (amount > paidAmount) {
                                change = amount - paidAmount;
                            } else {
                                change = 0;
                            }
                            partialData.push(
                                ...[
                                    { value: change, default: 0, path: [paymentPath, i, Prisma.PaymentSaleReturnScalarFieldEnum.change] },

                                ]
                            )

                        }
                    }
                }
            }
            return partialData;
        }
    })

    useMemo(() => {
        // console.log(data);
        const values = form.getValues();
        for (let v of data) {
            if (getValue(['value'], v) !== getValue(v.path, values)) {
                console.log("changed ", v.value, getValue(v.path, values))
                form.setValue(v.path.join('.'), v.value);
            }
        }
    }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal,warehouseId] = form.watch([
        Prisma.SaleReturnScalarFieldEnum.taxRate,
        Prisma.SaleReturnScalarFieldEnum.taxNet,
        Prisma.SaleReturnScalarFieldEnum.discount,
        Prisma.SaleReturnScalarFieldEnum.shipping,
        Prisma.SaleReturnScalarFieldEnum.grandTotal,
        Prisma.SaleReturnScalarFieldEnum.warehouseId]);

    const paymentStatus = form.watch(Prisma.SaleReturnScalarFieldEnum.paymentStatus);
    const paymentFields = useMemo(() => {

        if(paymentStatus==="Paid"){
            form.setValue(Prisma.SaleReturnScalarFieldEnum.paidAmount, grandTotal); 
        }

        if (paymentStatus === "Pending") {
            if (paymentSaleReturnsForm.fields.length > 0) {
                paymentSaleReturnsForm.replace([])
            }
        } else if (paymentStatus && paymentSaleReturnsForm.fields.length == 0 && paymentSaleReturnData.length==0) {
            const date = new Date();
            const ref = Date.now();
            const amount = paymentStatus === "Partial"?0:grandTotal;
            
            paymentSaleReturnsForm.replace([{ date: date, ref: `${ref}`, amount: amount, change: 0, }]);
            
        }
        else if (paymentSaleReturnsForm.fields.length>0&&paymentSaleReturnData.length>0) {
            const props = {...paidAmountField!,props:{...paidAmountField!.props,disabled:paymentStatus==="Paid"}}
            const paidInput = <FormInputField key={paidAmountField!.name} {...props} />
            return [paymentSaleReturnData.at(0)!.fields.slice(0, 2), paidInput, ...paymentSaleReturnData.at(0)!.fields!.slice(2)]
        }
        return [];
    }, [paymentStatus,paymentSaleReturnsForm.fields.length,paymentSaleReturnData.length])
   
    useEffect(()=>{
        if(paymentStatus==="Paid"){
            form.setValue(Prisma.SaleReturnScalarFieldEnum.paidAmount, grandTotal); 
        }
    },[grandTotal,paymentStatus]);

    return (
        <FormContainer title={<h2>Create Sale return</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                console.log(data);
                await result.mutateAsync(data as any);
              //  form.reset();

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
                            saleReturnDetailsForm.append(v);
                            if (reset) {
                                reset();
                            }

                        }}
                        useGetDataHook={() => {
                            const { labels, data, ...rest } = useProductSearch(
                                {
                                    format: productToSaleReturnDetailFormater,
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
                                const detail = row.original as SaleReturnDetail & {
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
                                return <button onClick={() => saleReturnDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
                    {paymentSaleReturnData.length > 0 && paymentFields}
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
            {(props) => <CreateSaleReturn {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;



