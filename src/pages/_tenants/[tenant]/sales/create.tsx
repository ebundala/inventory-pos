import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createSaleInputSchema } from "@/core/sale/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getValue, useZodForm, ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useEffect, useMemo } from "react";
import { FieldArrayPath, FieldValues, useFieldArray } from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { Customer, PaymentSale, Prisma, Product, ProductVariant, SaleDetail, Unit, Warehouse } from '@prisma/client'
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
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";


export function useSaleFormFieldOptions(opts?: { warehouse?: Warehouse; customer?: Customer; }) {
    const { customer, warehouse } = opts ?? {};
    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            combobox: {
                elevation: 30,
                value: warehouse ?? undefined,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useWarehouseSearch
            }
        },
        customerId: {
            label: "Customer",
            ordering: 3,
            combobox: {
                elevation: 30,
                value: customer ?? undefined,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useCustomerSearch
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
                "Pending", "Ordered","Completed"
            ]
        },
        paymentStatus: {
            label: "Payment Status",
            ordering: 8,
            options: [
                "Pending", "Partial", "Paid"
            ]
        },
        isPos: { hidden: true, registerOptions: { value: false } },
        notes: {
            label: "Notes",
            textArea: true,
            ordering: 9
        },
        ref: {
            label: "Reference",
            hidden: true,
            ordering: 9
        },
        taxNet: {
            label: "Tax total",
            hidden: true,
            ordering: 10,
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11
        },
        paidAmount:{
            label:"Paying Amount",
            registerOptions:{
                value:0
            }
        },
        id: { hidden: true },
        userId: {
            hidden: true
        },
        tenantId: {
            hidden: true
        },
        "saleDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "saleDetails.0.price": {
            label: "Unit Price",
            hideLabel: true,
            readonly: true,
            ordering: 14,
            //hidden: true
        },
        "saleDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
        },
        "saleDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true
        },
        "saleDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: true,
            ordering: 17
        },
        "saleDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: true,
            ordering: 18
        },
        "saleDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },
        "saleDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "saleDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },
        "saleDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },
        "saleDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
        "paymentSales.0.date": {
            hidden: true
        },
        "paymentSales.0.ref": {
            hidden: true
        },
        "paymentSales.0.notes": {
            hidden: true
        },
        "paymentSales.0.amount": {
            label: "Received Amount",
            ordering: 11
        },
        "paymentSales.0.reglement": {
            label: "Payment method",
            ordering: 10,
            options: [
                "Cash",
                "Credit Card",
                "Cheque",
                "Mobile",
                "Bank wire",
                "Other"

            ]
        },
        "paymentSales.0.change": {
            label: "Change",
             readonly: true,
             ordering: 13,
        },
    }), [customer, warehouse,]);
}

export function CreateSale({ tenant, defaultWarehouse, user, setting, defaultCurrency, }: TAppConfig) {
    const symbol = defaultCurrency?.symbol ?? "";

    const options = useSaleFormFieldOptions();

    const [config, form] = useZodForm(createSaleInputSchema, options, {
        defaultValues: { tenantId: tenant?.tenantId, userId: user?.id, }
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
    const result = trpcWithHost.sale.create.useMutation();



    useEffect(() => {
        form.setValue(Prisma.SaleScalarFieldEnum.date, new Date())
        form.setValue(Prisma.SaleScalarFieldEnum.ref, Date.now().toString())
        form.setValue(Prisma.SaleScalarFieldEnum.taxRate, 0)
        form.setValue(Prisma.SaleScalarFieldEnum.discount, 0)
        form.setValue(Prisma.SaleScalarFieldEnum.shipping, 0)

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
            const paymentPath="paymentSales";
            let subTotal = 0,grandTotal=0, taxNet = 0;

            if (data) {
                const details = getValue([detailsPath],data);
                const paymentSales = getValue([paymentPath],data)
                let taxRate = getValue([Prisma.SaleScalarFieldEnum.taxRate],data);
                let discount = getValue([Prisma.SaleScalarFieldEnum.discount],data);
                let shipping = getValue([Prisma.SaleScalarFieldEnum.shipping],data);
                let paidAmount = getValue([Prisma.SaleScalarFieldEnum.paidAmount],data);

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

                if(paymentSales && paymentSales instanceof Array){
                    for (let i = 0; i < paymentSales.length; i++) {
                        const item = paymentSales[i];
                        if (item) {
                            let payment = item as PaymentSale;
                            const amount = getValue([Prisma.PaymentSaleScalarFieldEnum.amount],payment)
                            let change = amount;
                              if(amount>paidAmount){
                                 change = amount-paidAmount;
                              }else{
                                change=0;
                              }
                            partialData.push(
                                ...[
                                    { value: change, default: 0, path: [paymentPath,i,Prisma.PaymentSaleScalarFieldEnum.change] },

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
            // Todo find better way to detect changes 
            if (getValue(['value'],v) !== getValue(v.path, values)) {
                 console.log("changed ",v.value,getValue(v.path,values))
              //  if (!v.value) {
                  //  form.setValue(v.path.join('.'), v.default);
                //} else {
                    form.setValue(v.path.join('.'), v.value);

               // }
            }
        }
    }, [data]);

    const [taxRate, taxNet, discount, shipping, grandTotal] = form.watch([
        Prisma.SaleScalarFieldEnum.taxRate,
        Prisma.SaleScalarFieldEnum.taxNet,
        Prisma.SaleScalarFieldEnum.discount,
        Prisma.SaleScalarFieldEnum.shipping,
        Prisma.SaleScalarFieldEnum.grandTotal])
    const paymentStatus = form.watch(Prisma.SaleScalarFieldEnum.paymentStatus);
    const paymentFields = useMemo(() => {
        if (paymentStatus === "Pending") {
            if (paymentSalesForm.fields.length > 0) {
                paymentSalesForm.remove([0])
            }
        } else if (paymentStatus && paymentSalesForm.fields.length == 0) {
            const date = new Date();
            const ref = Date.now();
            paymentSalesForm.insert(0,{ date:date, ref: `${ref}`, amount: 0, change: 0, });
        }
        if (paymentSaleData.length) {
            const paidInput = <FormInputField key={paidAmountField!.name} {...paidAmountField!} />
            return [paymentSaleData.at(0)!.fields.slice(0,2), paidInput, ...paymentSaleData.at(0)!.fields!.slice(2)]
        }
        return [];
    }, [paymentStatus,paymentSaleData])

    return (
        <FormContainer title={<h2>Create Sale</h2>}>
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
                    {paymentSaleData.length>0 && paymentFields}
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
            {(props) => <CreateSale {...props} />}
        </CollectRequiredDataWrapper>
    )
}
Index.getLayout = getLayout;



