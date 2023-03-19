import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateSaleReturnInputSchema } from "@/core/sale_return/index.zod";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useSaleReturn } from "@/lib/hooks/useSaleReturn";
import { useSaleReturnFormFieldOptions } from "@/lib/hooks/useSaleReturnFormFieldOptions";
import { useEffect, useMemo } from "react";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import {
  PaymentSaleReturn,
  Prisma,
  Product,
  ProductVariant,
  ProductWarehouse,
  SaleReturnDetail,
  Unit,
} from "@prisma/client";
import {
  TComputedFormFieldsResult,
  useComputedZodFormValues,
} from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import {
  useProductSearch,
  productToSaleReturnDetailFormater,
  productDefaultQueryBuilder,
} from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useGroupedFieldArray } from "@/lib/hooks/useGroupedFieldArray";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useSaleReturnConstraints } from "@/lib/hooks/useSaleReturnConstraints";
import { numberFormat } from "@/lib/util";

interface SaleReturnPathProps extends ParsedUrlQuery {
  saleReturnId: string;
}
export function UpdateSaleReturn({
  setting,
  saleReturn,
  defaultCurrency,
  refetch,
}: SaleReturnRequiredDataReturnType["data"]) {
  const symbol = defaultCurrency?.symbol ?? "";

  
  if (!saleReturn || !saleReturn?.id)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid record</span>
      </div>
    );
  return (
    <FormContainer title={<h2>Sale return ref#{saleReturn.ref}</h2>}>
                  <div className="grid grid-flow-row grid-cols-3">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Customer info </th></tr>
                <tr><td>{saleReturn.customer.name}</td></tr>
                <tr><td>{saleReturn.customer.email}</td></tr>
                <tr><td>{saleReturn.customer.address}</td></tr>
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
                <tr><th>Sale return info </th></tr>
                <tr><td>Reference: {saleReturn.ref}</td></tr>
                <tr><td>Status: {saleReturn.status}</td></tr>
                <tr><td>Warehouse: {saleReturn.warehouse.name}</td></tr>
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
            rowsData={saleReturn.saleReturnDetails}
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
                    const unit = row.original?.product?.productSaleUnit as Unit;
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
            taxRate={saleReturn.taxRate!}
            tax={saleReturn.taxNet!}
            discount={saleReturn.discount!}
            shipping={saleReturn.shipping!}
            grandTotal={saleReturn.grandTotal}
          />
        </div>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useSaleReturnRequiredData}>
      {(props) => {
        return <UpdateSaleReturn {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

function useSaleReturnRequiredData() {
  const router = useRouter();
  const saleReturnId = parseInt(
    (router.query as SaleReturnPathProps).saleReturnId ?? ""
  );
  const {
    saleReturn,
    result: { isLoading: loading },
    refetch,
  } = useSaleReturn(saleReturnId);
  const {
    tenant,
    result: { isLoading: tenantLoading },
  } = useTenant();
  const {
    setting,
    result: { isLoading: settingLoading },
  } = useSetting();
  return useMemo(
    () => ({
      data: {
        tenant,
        setting,
        defaultCurrency: setting?.currency,
        saleReturn,
        refetch,
      },
      isLoading: tenantLoading || loading || settingLoading,
    }),
    [tenantLoading, loading, settingLoading]
  );
}
type SaleReturnRequiredDataReturnType = ReturnType<
  typeof useSaleReturnRequiredData
>;
