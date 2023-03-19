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
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { PaymentSale, Prisma, Product, ProductVariant, ProductWarehouse, SaleDetail, Unit } from "@prisma/client";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useProductSearch, productToSaleDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { useSaleConstraints } from "@/lib/hooks/useSaleConstraints";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { numberFormat } from "@/lib/util";

interface SalePathProps extends ParsedUrlQuery {
    saleId: string;
}
export function UpdateSale({ setting, sale, defaultCurrency, refetch }: SaleRequiredDataReturnType['data']) {

    const symbol = defaultCurrency?.symbol ?? "";

  
    if (!sale || !sale?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid sale</span>
        </div>)
    return (
        <FormContainer title={<h2>Sale ref# {sale.ref}</h2>}>
            <div className="grid grid-flow-row grid-cols-3">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Customer info </th></tr>
                <tr><td>{sale.customer.name}</td></tr>
                <tr><td>{sale.customer.email}</td></tr>
                <tr><td>{sale.customer.address}</td></tr>
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
                <tr><th>sale info </th></tr>
                <tr><td>Reference: {sale.ref}</td></tr>
                <tr><td>Status: {sale.status}</td></tr>
                <tr><td>Warehouse: {sale.warehouse.name}</td></tr>
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
            rowsData={sale.saleDetails}
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
                Header: `Unit price (${symbol})`,
                accessor: "price",
                disableSortBy: true,
                Cell:numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})

              },
              
              {
                Header: "Quantity",
                accessor: "quantity",
                disableSortBy: true,
                Cell:({row,value}:{row:any,value:number})=>{
                    const unit = row.original?.product?.productsSaleUnit as Unit;
                    const v =numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})({value});
                    return <span>{v}<span className=" text-sm text-primary pl-2">{unit?.shortName}</span></span>
                }
              },
              {
                  Header: `Discount (${symbol})`,
                  accessor: "discount",
                  disableSortBy: true,
                  Cell:numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})
              },
              {
                Header: `Tax (${symbol})`,
                accessor: "taxNet",
                disableSortBy: true,
                Cell:numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})
              },
              {
                Header: `Subtotal (${symbol})`,
                accessor: "total",
                disableSortBy: true,
                Cell:numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})
              }
             
            ]}
            search={false}
            pagenation={false}
          />
        </div>
        <div className="w-full mt-10 flex justify-end">
          <OrderSummary
            currency={defaultCurrency?.symbol ?? ""}
            taxRate={sale.taxRate!}
            tax={sale.taxNet!}
            discount={sale.discount!}
            shipping={sale.shipping!}
            grandTotal={sale.grandTotal}
          />
        </div>
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useSaleRequiredData}>
            {(props) => {
                return <UpdateSale {...props} />
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function useSaleRequiredData() {
    const router = useRouter();
    const saleId = parseInt((router.query as SalePathProps).saleId ?? "");
    const { sale, result: { isLoading: loading, }, refetch } = useSale(saleId);
    const { tenant, result: { isLoading: tenantLoading } } = useTenant();
    const { setting, result: { isLoading: settingLoading } } = useSetting();
    return useMemo(() => ({
        data: {
            tenant,
            setting,
            defaultCurrency: setting?.currency,
            sale,
            refetch
        },
        isLoading: tenantLoading || loading || settingLoading
    }),
        [tenantLoading, loading, settingLoading]);
}
type SaleRequiredDataReturnType = ReturnType<typeof useSaleRequiredData>