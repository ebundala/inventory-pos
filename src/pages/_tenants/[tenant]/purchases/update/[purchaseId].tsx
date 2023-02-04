import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updatePurchaseInputSchema } from "@/core/purchase/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { usePurchase } from "@/lib/hooks/usePurchase";
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
import { Prisma, Product, ProductVariant, ProductWarehouse, PurchaseDetail, Unit } from "@prisma/client";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useProductSearch, productToPurchaseDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { usePurchaseFormFieldOptions } from "../../../../../lib/hooks/usePurchaseFormFieldOptions";

interface PurchasePathProps extends ParsedUrlQuery {
    purchaseId: string;
}
export function UpdatePurchase({tenant,purchase,defaultCurrency,refetch}:PurchaseRequiredDataReturnType['data']) {
    
    const symbol = defaultCurrency?.symbol ?? "";
    
    const options = usePurchaseFormFieldOptions(purchase as any);

    const [config, form] = useZodForm(updatePurchaseInputSchema, options, {
        defaultValues: { ...(purchase??{}) }
    });

    const [regularConfig, fieldArrayConfig] = useSplitFormConfigToFieldArray(config)
    const groupedFieldArray = useMemo(()=>{
        const fields = new Map<string,ZodFormFieldConfig[]>();
        for(let v of fieldArrayConfig){
           const fieldName = v.name.split('.')[0] as string;
           const data = fields.get(fieldName) ?? [];
           data.push(v);
           fields.set(fieldName,data);
        }
        return fields;
      
    },[fieldArrayConfig]);
    const purchaseDetailFieldConfig = groupedFieldArray.get('purchaseDetails');
    const paymentPurchaseFieldConfig = groupedFieldArray.get('paymentPurchases')
    const purchaseDetailFormName = useFieldArrayName(purchaseDetailFieldConfig!);
    const paymentPurchaseFormName = useFieldArrayName(paymentPurchaseFieldConfig!);

    const purchaseDetailsForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: purchaseDetailFormName });
    const paymentPurchasesForm = useFieldArray<FieldValues, FieldArrayPath<FieldValues>, 'key'>({ control: form.control, name: paymentPurchaseFormName });

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.purchase.update.useMutation({
        onSuccess:(data, variables, context) =>{
           form.reset();
           refetch()
        },
    });



    useEffect(() => {
        if(purchase){
         form.reset(purchase);
        }      
    }, [purchase])

    const detailsData = useRenderFieldArrayForm(purchaseDetailFormName, purchaseDetailsForm, form, purchaseDetailFieldConfig!)
    const purchasesData = useRenderFieldArrayForm(paymentPurchaseFormName, paymentPurchasesForm, form, paymentPurchaseFieldConfig!)


    const [notesField, fields] = useGetZodFormField(Prisma.PurchaseScalarFieldEnum.notes, regularConfig)

    const [mainFields, fields2] = useGetZodFormFields([
        Prisma.PurchaseScalarFieldEnum.date,
        Prisma.PurchaseScalarFieldEnum.warehouseId,
        Prisma.PurchaseScalarFieldEnum.supplierId], fields)

    const [secondaryFields, hiddenFields] = useGetZodFormFields([
        Prisma.PurchaseScalarFieldEnum.taxRate,
        Prisma.PurchaseScalarFieldEnum.discount,
        Prisma.PurchaseScalarFieldEnum.shipping,
        Prisma.PurchaseScalarFieldEnum.status,
    ], fields2)



    const data = useComputedZodFormValues({
        control: form.control, compute: (data) => {
            const partialData: TComputedFormFieldsResult = [];
            const rootPath = 'purchaseDetails';
            let taxRate = 0, discount = 0, shipping = 0, grandTotal = 0, subTotal = 0, taxNet = 0;

            if (data) {
                const details = data[rootPath];
                taxRate = data[Prisma.PurchaseScalarFieldEnum.taxRate] ?? 0;
                discount = data[Prisma.PurchaseScalarFieldEnum.discount] ?? 0;
                shipping = data[Prisma.PurchaseScalarFieldEnum.shipping] ?? 0;

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
                                { value: productQuantity, default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.quantity] },
                                { value: productTaxMethod, default: "inclusive", path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.taxMethod] },
                                { value: productPriceBeforeTax, default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.cost] },
                                { value: productTaxNet, default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.taxNet] },
                                { value: productSubTotal, default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.total] },
                                { value: productDiscount, default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.discount] },
                                { value: "default", default: 0, path: [rootPath, i, Prisma.PurchaseDetailScalarFieldEnum.discountMethod] }
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

    const [taxRate, taxNet, discount, shipping, grandTotal,warehouseId] = form.watch([
        Prisma.PurchaseScalarFieldEnum.taxRate,
        Prisma.PurchaseScalarFieldEnum.taxNet,
        Prisma.PurchaseScalarFieldEnum.discount,
        Prisma.PurchaseScalarFieldEnum.shipping,
        Prisma.PurchaseScalarFieldEnum.grandTotal,Prisma.PurchaseScalarFieldEnum.warehouseId])

    return (
        <FormContainer title={<h2>Update Purchase</h2>}>
            <form onSubmit={form.handleSubmit(async (data) => {
                //submit here
                console.log(data);
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
                            purchaseDetailsForm.append(v);
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
        <CollectRequiredDataWrapper useHooks={usePurchaseRequiredData}>
            {(props)=>{
                return <UpdatePurchase {...props}/>
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function usePurchaseRequiredData() {
    const router = useRouter();
    const purchaseId = parseInt((router.query as PurchasePathProps).purchaseId ?? "");
    const {purchase, result:{isLoading:loading,}, refetch} = usePurchase(purchaseId);
    const {tenant, result:{isLoading:tenantLoading}} = useTenant();    
    const {setting, result:{isLoading:settingLoading}} = useSetting(); 
    return {data:{ tenant,setting,defaultCurrency:setting?.currency ,purchase,refetch },isLoading: tenantLoading || loading || settingLoading};
}
type PurchaseRequiredDataReturnType = ReturnType<typeof usePurchaseRequiredData>