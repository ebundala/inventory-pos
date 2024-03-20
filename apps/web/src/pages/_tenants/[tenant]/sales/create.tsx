import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createSaleInputSchema } from "@/core/sale/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { PaymentSale, Prisma, Product, ProductVariant, ProductWarehouse, SaleDetail, Unit } from '@prisma/client'
import { FormComboBox } from "@/components/combobox";
import { CustomTable } from "@/components/table";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useProductSearch, productToSaleDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { OrderSummary } from "@/components/OrderSummary";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useSaleFormFieldOptions } from "@/lib/hooks/useSaleFormFieldOptions";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { calculateStock } from "@/lib/util/calculateStock";
import { TStockDataInput } from "@/types/TStockDataInput";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useSaleConstraints } from "@/lib/hooks/useSaleConstraints";


export function CreateSale({ tenant, user, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";

    const options = useSaleFormFieldOptions();

    const [config, form] = useZodForm(createSaleInputSchema, options, {
        defaultValues: {  }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const groupedFieldArray = useGroupedFieldArray(fieldArrayConfig);
    const saleDetailsConfig = groupedFieldArray.get("saleDetails")!
    const paymentSalesConfig = groupedFieldArray.get("paymentSales")!
    const shipmentsConfig = groupedFieldArray.get("shipments")!

    const saleDetailsFormName = useFieldArrayName(saleDetailsConfig);
    const paymentSalesFormName = useFieldArrayName(paymentSalesConfig);
    const shipmentsFormName = useFieldArrayName(shipmentsConfig);

    const saleDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: saleDetailsFormName });
    const paymentSalesForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: paymentSalesFormName });

    const trpcWithHost = useTrpcTenant();
    const {showProgress,callbacks} = useProgressFeedback("/sales")

    const result = trpcWithHost.sale.create.useMutation(callbacks);



    useEffect(() => {
        form.setValue(Prisma.SaleScalarFieldEnum.date, new Date())
        form.setValue(Prisma.SaleScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.SaleScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.SaleScalarFieldEnum.discount, 0)
        form.setValue(Prisma.SaleScalarFieldEnum.shipping, 0)
        form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, 0)
    }, [])

    const detailsData = useRenderFieldArrayForm(saleDetailsFormName, saleDetailsForm, form, saleDetailsConfig)

    const paymentSaleData = useRenderFieldArrayForm(paymentSalesFormName, paymentSalesForm, form, paymentSalesConfig)

    const [notesField, fields] = useGetZodFormField(Prisma.SaleScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.SaleScalarFieldEnum.date,
        Prisma.SaleScalarFieldEnum.warehouseId,
        Prisma.SaleScalarFieldEnum.customerId], fields)
    const [paidAmountField, fields3] = useGetZodFormField(Prisma.SaleScalarFieldEnum.paidAmount, fields2);
    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.SaleScalarFieldEnum.taxRate,
        Prisma.SaleScalarFieldEnum.discount,
        Prisma.SaleScalarFieldEnum.shipping,
        Prisma.SaleScalarFieldEnum.status,
        Prisma.SaleScalarFieldEnum.paymentStatus,
    ], fields3)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = 'saleDetails';
            const paymentPath = "paymentSales";
            let subTotal = 0, grandTotal = 0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath], data);
                const paymentSales = getValue([paymentPath], data)
                let taxRate = getValue([Prisma.SaleScalarFieldEnum.taxRate], data);
                let discount = getValue([Prisma.SaleScalarFieldEnum.discount], data);
                let shipping = getValue([Prisma.SaleScalarFieldEnum.shipping], data);
                let paidAmount = getValue([Prisma.SaleScalarFieldEnum.paidAmount], data);

                if (details && details instanceof Array) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<SaleDetail & {
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
                            const productPrice = (detail.product?.price ?? 0);
                            const taxValue = (productTaxRate / 100 * productPrice);
                            const productPriceBeforeTax = productPrice + (taxValue * productTaxMethodAction)
                            const productTaxNet = taxValue * productQuantity



                            const productSubTotal = productQuantity * productPriceBeforeTax + productTaxNet - productDiscount;
                            subTotal += productSubTotal;
                            partialData.push(...[
                                { value: productQuantity, default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.price] },
                                { value: productTaxNet, default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [detailsPath, i, Prisma.SaleDetailScalarFieldEnum.discountMethod] }
                            ])
                        }
                    }
                    taxNet = (subTotal - discount) * (taxRate / 100);
                    grandTotal = (subTotal + taxNet) + shipping;
                    partialData.push(...[
                        { value: taxNet, default: 0, path: [Prisma.SaleScalarFieldEnum.taxNet] },
                        { value: grandTotal, default: 0, path: [Prisma.SaleScalarFieldEnum.grandTotal] },
                        // { value: discount, default: 0, path: [Prisma.SaleScalarFieldEnum.discount] },
                        // { value: taxRate, default: 0, path: [Prisma.SaleScalarFieldEnum.taxRate] },
                        // { value: shipping, default: 0, path: [Prisma.SaleScalarFieldEnum.shipping] },

                    ])
                }

                if (paymentSales && paymentSales instanceof Array) {
                    for (let i = 0; i < paymentSales.length; i++) {
                        const item = paymentSales[i];
                        if (item) {
                            let payment = item as PaymentSale;
                            const amount = getValue([Prisma.PaymentSaleScalarFieldEnum.amount], payment)
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

    useSetComputedValues(form, data);

    const [taxRate, taxNet, discount, shipping, grandTotal,warehouseId] = form.watch([
        Prisma.SaleScalarFieldEnum.taxRate,
        Prisma.SaleScalarFieldEnum.taxNet,
        Prisma.SaleScalarFieldEnum.discount,
        Prisma.SaleScalarFieldEnum.shipping,
        Prisma.SaleScalarFieldEnum.grandTotal,
        Prisma.SaleScalarFieldEnum.warehouseId]);

    const paymentStatus = form.watch(Prisma.SaleScalarFieldEnum.paymentStatus);
    const paymentFields = useMemo(() => {

        if(paymentStatus==="Paid"){
            form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal); 
        }

        if (paymentStatus === "Pending") {
            if (paymentSalesForm.fields.length > 0) {
                paymentSalesForm.replace([])
            }
        } else if (paymentStatus && paymentSalesForm.fields.length == 0 && paymentSaleData.length==0) {
            const date = new Date();
            const ref = Date.now();
            const amount = paymentStatus === "Partial"?0:grandTotal;
            
            paymentSalesForm.replace([{ date: date, ref: `${ref}`, amount: amount, change: 0, }]);
            
        }
        else if (paymentSalesForm.fields.length>0&&paymentSaleData.length>0) {
            const props = {...paidAmountField!,props:{...paidAmountField!.props,disabled:paymentStatus==="Paid"}}
            const paidInput = <FormInputField key={paidAmountField!.name} {...props} />
            return [paymentSaleData.at(0)!.fields.slice(0, 2), paidInput, ...paymentSaleData.at(0)!.fields!.slice(2)]
        }
        return [];
    }, [paymentStatus,paymentSalesForm.fields.length,paymentSaleData.length])
   
    useEffect(()=>{
        if(paymentStatus==="Paid"){
            form.setValue(Prisma.SaleScalarFieldEnum.paidAmount, grandTotal); 
        }
    },[grandTotal,paymentStatus]);
    const checkDuplicates = useEnforceUniqueProduct(saleDetailsForm as any)
    const constraints = useSaleConstraints(form.control);
    useSetComputedValues(form,constraints);

    return (
        <FormContainer title={<h2>Create Sale</h2>}>
            <form >
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
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const { labels, data, ...rest } = useProductSearch(
                                {
                                    format: productToSaleDetailFormater,
                                    queryBuilder: productDefaultQueryBuilder,
                                } as any
                            );

                            return { data: labels, ...rest }
                        }}

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
                                const detail = row.original as TStockDataInput;
                                return calculateStock(detail,warehouseId);
                            },
                        },
                        {
                            Header: "Quantity",
                            accessor: "fields.2",
                            disableSortBy: true,
                            Cell: ({ row, value }: { value: any; row: any }) => {
                                const detail = row.original as TStockDataInput;
                                const stock = calculateStock(detail, warehouseId);
                                //Dirty way to enforce max stock level
                                if (value?.props?.props) {
                                  value.props.props.max = stock;
                                }
              
                                return value;
                              },
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
                                return <button onClick={() => saleDetailsForm.remove(row.index)} className="btn btn-warning btn-outline btn-xs">remove</button>
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
                    {paymentSaleData.length > 0 && paymentFields}
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

                    <button type="submit" className=" btn btn-primary rounded-md  "
                    onClick={form.handleSubmit(async (data) => {
                        //submit here
                       showProgress({animated:true});
                       await result.mutateAsync(data as any);
                      
        
                    }, (e) => {
                        console.error(e);
                    })} >Submit </button>
                </div>
            </form>
        </FormContainer>
    )
}


export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useAppConfig}>
            {(props) => <CreateSale {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;




