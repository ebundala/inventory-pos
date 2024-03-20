import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useTenant } from "@/lib/hooks/useTenant";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { usePurchase } from "@/lib/hooks/usePurchase";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSetting } from "@/lib/hooks/useSetting";
import { Unit } from "@prisma/client";
import { OrderSummary } from "@/components/OrderSummary";
import { CustomTable } from "@/components/table";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { numberFormat } from "@/lib/util";

interface PurchasePathProps extends ParsedUrlQuery {
    purchaseId: string;
}
export function ViewPurchase({setting,purchase,defaultCurrency,refetch}:PurchaseRequiredDataReturnType['data']) {
    const symbol = defaultCurrency?.symbol ?? "";

    if (!purchase || !purchase?.id) return (
        <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
            <span className="m-auto">Invalid record</span>
        </div>)
    return (
        <FormContainer title={<h2>Purchase ref# {purchase?.ref}</h2>}>
            <div className="grid grid-flow-row grid-cols-3">
      <div >
        <table className="table">
            <tbody>
                <tr><th>Supplier info </th></tr>
                <tr><td>{purchase.supplier.name}</td></tr>
                <tr><td>{purchase.supplier.email}</td></tr>
                <tr><td>{purchase.supplier.address}</td></tr>
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
                <tr><th>Purchase info </th></tr>
                <tr><td>Reference: {purchase.ref}</td></tr>
                <tr><td>Status: {purchase.status}</td></tr>
                <tr><td>Warehouse: {purchase.warehouse.name}</td></tr>
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
            rowsData={purchase.purchaseDetails}
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
                    const unit = row.original?.product?.productsSaleUnit as Unit;
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
            taxRate={purchase.taxRate!}
            tax={purchase.taxNet!}
            discount={purchase.discount!}
            shipping={purchase.shipping!}
            grandTotal={purchase.grandTotal}
          />
        </div>
        </FormContainer>
    )
}



export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={usePurchaseRequiredData}>
            {(props)=>{
                return <ViewPurchase {...props}/>
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