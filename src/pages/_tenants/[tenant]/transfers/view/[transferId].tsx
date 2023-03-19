import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateTransferInputSchema } from "@/core/transfer/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { getValue, useZodForm } from "@/lib/util/form-gen";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useTransfer } from "@/lib/hooks/useTransfer";
import { useEffect, useMemo } from 'react';
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";
import { Prisma, Product, ProductVariant, ProductWarehouse, TransferDetail, Unit } from "@prisma/client";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { FormComboBox } from "@/components/combobox";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useProductSearch, productToTransferDetailFormater, productDefaultQueryBuilder } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useTransferFormFieldOptions } from "@/lib/hooks/useTransferFormFieldOptions";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useTransferConstraints } from "@/lib/hooks/useTransferConstraints";
import { numberFormat } from "@/lib/util";

interface TransferPathProps extends ParsedUrlQuery {
    transferId: string;
}
export function ViewTransfer({ setting,transfer, defaultCurrency, refetch }: TransferRequiredDataReturnType['data']) {

    const symbol = defaultCurrency?.symbol ?? "";

    
    if (!transfer || !transfer?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid record</span>
        </div>)
    return (
        <FormContainer title={<h2>Transfer ref# {transfer.ref}</h2>}>
                      <div className="grid grid-flow-row grid-cols-4">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Source Warehouse</th></tr>
                <tr><td>Name: {transfer.fromWarehouse.name}</td></tr>
                <tr><td>City:{transfer.fromWarehouse.city}</td></tr>
                <tr><td>Email:{transfer.fromWarehouse.email}</td></tr>
                <tr><td>Phone:{transfer.fromWarehouse.mobile}</td></tr>
                <tr><td>Address:{transfer.fromWarehouse.zip}</td></tr>

            </tbody>
        </table>
      </div>
      <div >
      <table className="table">
            <tbody>
                <tr><th>Destination Warehouse</th></tr>
                <tr><td>Name: {transfer.toWarehouse.name}</td></tr>
                <tr><td>City:{transfer.toWarehouse.city}</td></tr>
                <tr><td>Email:{transfer.toWarehouse.email}</td></tr>
                <tr><td>Phone:{transfer.toWarehouse.mobile}</td></tr>
                <tr><td>Address:{transfer.toWarehouse.zip}</td></tr>

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
                <tr><th>Transfer info </th></tr>
                <tr><td>Reference: {transfer.ref}</td></tr>
                <tr><td>Status: {transfer.status}</td></tr>
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
            rowsData={transfer.transferDetails}
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
                Cell:numberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:2})

              },
              
              {
                Header: "Quantity",
                accessor: "quantity",
                disableSortBy: true,
                Cell:({row,value}:{row:any,value:number})=>{
                    const unit = row.original?.product?.productUnit as Unit;
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
            taxRate={transfer.taxRate!}
            tax={transfer.taxNet!}
            discount={transfer.discount!}
            shipping={transfer.shipping!}
            grandTotal={transfer.grandTotal}
          />
        </div>
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useTransferRequiredData}>
            {(props) => {
                return <ViewTransfer {...props} />
            }}
        </CollectRequiredDataWrapper>
    )
}

Index.getLayout = getLayout;



function useTransferRequiredData() {
    const router = useRouter();
    const transferId = parseInt((router.query as TransferPathProps).transferId ?? "");
    const { transfer, result: { isLoading: loading, }, refetch } = useTransfer(transferId);

    const { tenant, result: { isLoading: tenantLoading } } = useTenant();
    const { setting, result: { isLoading: settingLoading } } = useSetting();

        return {
        data: {
            tenant,
            setting,
            defaultCurrency: setting?.currency,
            transfer,
            refetch
        },
        isLoading: tenantLoading || loading || settingLoading
    };
}
type TransferRequiredDataReturnType = ReturnType<typeof useTransferRequiredData>