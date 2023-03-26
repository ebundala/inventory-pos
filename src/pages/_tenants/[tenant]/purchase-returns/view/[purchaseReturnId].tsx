/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updatePurchaseReturnInputSchema } from "@/core/purchase_return/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { usePurchaseReturn } from "@/lib/hooks/usePurchaseReturn";
import { useEffect, useMemo } from 'react';
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
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
import { numberFormat } from "@/lib/util";

interface PurchaseReturnPathProps extends ParsedUrlQuery {
    purchaseReturnId: string;
}
export function UpdatePurchaseReturn({setting,purchaseReturn,defaultCurrency,refetch}:PurchaseReturnRequiredDataReturnType['data']) {
    
    const symbol = defaultCurrency?.symbol ?? "";
    
    if (!purchaseReturn || !purchaseReturn?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid record</span>
        </div>)
        
    return (
        <FormContainer title={<h2>Purchase Return ref#{purchaseReturn.ref}</h2>}>
                 <div className="grid grid-flow-row grid-cols-3">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Supplier info </th></tr>
                <tr><td>{purchaseReturn.supplier.name}</td></tr>
                <tr><td>{purchaseReturn.supplier.email}</td></tr>
                <tr><td>{purchaseReturn.supplier.address}</td></tr>
            </tbody>
        </table>
      </div>
      <div >
      <table className="table">
            <tbody>
                <tr><th>Company info </th></tr>
                <tr><td>{setting?.companyName}</td></tr>
                <tr><td>{setting?.email}</td></tr>
                <tr><td>{setting?.companyPhone}</td></tr>
                <tr><td>{setting?.companyAddress}</td></tr>

            </tbody>
        </table>
      </div>
      <div>
      <table className="table">
            <tbody>
                <tr><th>purchaseReturn info </th></tr>
                <tr><td>Reference: {purchaseReturn.ref}</td></tr>
                <tr><td>Status: {purchaseReturn.status}</td></tr>
                <tr><td>Warehouse: {purchaseReturn.warehouse.name}</td></tr>
            </tbody>
        </table>
      </div>
     </div>
     <div className="flex flex-row p-4">
        <h2 className="text-xl font-bold">
            Order Summary
        </h2>
     </div>
     <div className="w-full  ">
          <CustomTable
            colDeps={[]}
            rowsData={purchaseReturn.purchaseReturnDetails}
            collumsData={() => [
             
              {
                Header: "Product",
                accessor: "productId",
                disableSortBy: true,
                Cell: ({ row }: { row: any }) => {
                  return (
                    <div className="w-[160px] whitespace-normal text-ellipsis break-words">
                      {getProductFormatedName(row.original)}
                    </div>
                  );
                },
              },
              {
                Header: `Unit cost (${symbol})`,
                accessor: "cost",
                disableSortBy: true,
                Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})

              },
              
              {
                Header: "Quantity",
                accessor: "quantity",
                disableSortBy: true,
                Cell:({row,value}:{row:any,value:number})=>{
                    const unit = row.original?.product?.productPurchaseUnit as Unit;
                    const v =numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})({value});
                    return <span>{v}<span className=" text-sm text-primary pl-2">{unit?.shortName}</span></span>
                }
              },
              {
                  Header: `Discount (${symbol})`,
                  accessor: "discount",
                  disableSortBy: true,
                  Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})
              },
              {
                Header: `Tax (${symbol})`,
                accessor: "taxNet",
                disableSortBy: true,
                Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})
              },
              {
                Header: `Subtotal (${symbol})`,
                accessor: "total",
                disableSortBy: true,
                Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})
              }
             
            ]}
            search={false}
            pagenation={false}
          />
        </div>
        <div className="w-full mt-10 flex justify-end">
          <OrderSummary
            currency={defaultCurrency?.code ?? ""}
            taxRate={purchaseReturn.taxRate!}
            tax={purchaseReturn.taxNet!}
            discount={purchaseReturn.discount!}
            shipping={purchaseReturn.shipping!}
            grandTotal={purchaseReturn.grandTotal}
          />
        </div>
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