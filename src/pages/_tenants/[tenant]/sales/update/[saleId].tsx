import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateSaleInputSchema } from "@/core/sale/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useSale } from "@/lib/hooks/useSale";
import { useSaleFormFieldOptions } from "@/lib/hooks/useSaleFormFieldOptions";
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
import { PaymentSale, Prisma, Product, ProductVariant, SaleDetail, Unit } from "@prisma/client";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useProductSearch, productToSaleDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useToast } from "@/lib/hooks/useToast";
import { ToastMessageType } from "@/types/ToastMessageType";

interface SalePathProps extends ParsedUrlQuery {
    saleId: string;
}
export function UpdateSale({tenant,sale,defaultCurrency,refetch}:SaleRequiredDataReturnType['data']) {
    
    const symbol = defaultCurrency?.symbol ?? "";
    
    const options = useSaleFormFieldOptions(sale as any);

    const [config, form] = useZodForm(updateSaleInputSchema, options, {
        defaultValues:{ ...(sale??{})}
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
    const shipmentForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: shipmentsFormName });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.sale.update.useMutation({
        onSuccess:(data, variables, context) =>{
           // form.reset();
          //  refetch();
          // router.push("/sales") 
          
        },
    });

    useEffect(() => {
        if(sale){
         form.reset(sale);
         
        }
    }, [sale])

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
                            const saleUnitId = detail.product?.unitSaleId;
                            const stockUnitId = detail.product?.unitId;
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
        Prisma.SaleScalarFieldEnum.taxRate,
        Prisma.SaleScalarFieldEnum.taxNet,
        Prisma.SaleScalarFieldEnum.discount,
        Prisma.SaleScalarFieldEnum.shipping,
        Prisma.SaleScalarFieldEnum.grandTotal]);

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

        if (!sale || !sale?.id) return (
            <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
                <span className="m-auto">Invalid sale</span>
            </div>)
    return (
        <FormContainer title={<h2>Update Sale</h2>}>
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
                        saleDetailsForm.append(v);
                        if (reset) {
                            reset();
                        }

                    }}
                    useGetDataHook={() => {
                        const { labels, data, ...rest } = useProductSearch(
                            {
                                format: productToSaleDetailFormater,
                                queryBuilder: productDefaultQueryBuilder,
                            } as any
                        );

                        return { data: labels, ...rest }
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
                                <span className="text text-elipsis w-[80px]">
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
                            return <button onClick={(e) => {
                                e.preventDefault();
                                saleDetailsForm.remove(row.index)}
                            } className="btn btn-warning btn-outline btn-xs">remove</button>
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

                <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
            </div>
        </form>
    </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useSaleRequiredData}>
            {(props)=>{
                return <UpdateSale {...props}/>
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function useSaleRequiredData() {
    const router = useRouter();
    const saleId = parseInt((router.query as SalePathProps).saleId ?? "");
    const {tenant, result:{isLoading:tenantLoading}} = useTenant();    
    const {setting, result:{isLoading:settingLoading}} = useSetting(); 
    const {sale, result:{isLoading:loading,}, refetch} = useSale(saleId);
    return {data:{ tenant,setting,defaultCurrency:setting?.currency ,sale,refetch },isLoading: tenantLoading || loading || settingLoading};
}
type SaleRequiredDataReturnType = ReturnType<typeof useSaleRequiredData>