import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useQuotation } from "@/lib/hooks/useQuotation";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import {
  Unit,
} from "@prisma/client";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { numberFormat } from "@/lib/util";

interface QuotationPathProps extends ParsedUrlQuery {
  quotationId: string;
}
export function ViewQuotation({
  tenant,
  quotation,
  setting,
  defaultCurrency,
  refetch,
}: QuotationRequiredDataReturnType["data"]) {
    const symbol = defaultCurrency?.symbol ?? "";

  if (!quotation || !quotation?.id)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid record</span>
      </div>
    );
  return (
    <FormContainer title={<h2>Quotation ref# {quotation.ref}</h2>}>
     <div className="grid grid-flow-row grid-cols-3">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Customer info </th></tr>
                <tr><td>{quotation.customer.name}</td></tr>
                <tr><td>{quotation.customer.email}</td></tr>
                <tr><td>{quotation.customer.address}</td></tr>
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
                <tr><th>Quotation info </th></tr>
                <tr><td>Reference: {quotation.ref}</td></tr>
                <tr><td>Status: {quotation.status}</td></tr>
                <tr><td>Warehouse: {quotation.warehouse.name}</td></tr>
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
            rowsData={quotation.quotationDetails}
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
            taxRate={quotation.taxRate!}
            tax={quotation.taxNet!}
            discount={quotation.discount!}
            shipping={quotation.shipping!}
            grandTotal={quotation.grandTotal}
          />
        </div>
    </FormContainer>
  );
}


export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useQuotationRequiredData}>
      {(props) => {
        return <ViewQuotation {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

function useQuotationRequiredData() {
  const router = useRouter();
  const quotationId = parseInt(
    (router.query as QuotationPathProps).quotationId ?? ""
  );
  const {
    quotation,
    result: { isLoading: loading },
    refetch,
  } = useQuotation(quotationId);
  const {
    tenant,
    result: { isLoading: tenantLoading },
  } = useTenant();
  const {
    setting,
    result: { isLoading: settingLoading },
  } = useSetting();
  return {
    data: {
      tenant,
      setting,
      defaultCurrency: setting?.currency,
      quotation,
      refetch,
    },
    isLoading: tenantLoading || loading || settingLoading,
  };
}
type QuotationRequiredDataReturnType = ReturnType<
  typeof useQuotationRequiredData
>;
