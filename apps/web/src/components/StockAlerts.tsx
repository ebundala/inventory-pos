import { pageOptions } from "@/lib/config/pageOptions";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { numberFormat } from "@/lib/util";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { CustomTable } from "./table";

export function StockAlerts({ take, skip, pagenated }: { take?: number, skip?: number, pagenated?: boolean}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.stockAlerts.useQuery({ take: take, skip: skip });
  if (result.isLoading)
    return null;

  if (pagenated) {
    return <CustomTable
    printTitle={"Stock Alerts"}
    pageOptions={pageOptions}
      rowsData={result.data ?? []}
      collumsData={() => ([
        {
          Header: "Code",
          accessor: "product.code",
          Cell:({value}:{value:any})=>{
            return <th>{value}</th>;
          }
        },
        {
          Header: "Name",
          accessor: "product.name",
          Cell: ({ row }: { row: any }) => {
            return getProductFormatedName(row.original);
          }
        },
        {
          Header: "Warehouse",
          accessor: "warehouse.name"
        },
        {
          Header: "Alert level",
          accessor: "product.stockAlert",
          Cell: (v: any) => {
            const qty = numberFormat(undefined, { maximumFractionDigits: 2 })(v);
            const unit = v?.row?.original?.product?.productUnit?.shortName
            return <>
              {qty}<span className=" ml-1 text-sm text-orange-400">{unit}</span>
            </>

          }
        },
        {
          Header: "In Stock",
          accessor: "_sum.qty",
          Cell: (v: any) => {
            const qty = numberFormat(undefined, { maximumFractionDigits: 2 })(v);
            const unit = v?.row?.original?.product?.productUnit?.shortName
            return <>
              {qty}<span className=" ml-1 text-sm text-orange-400">{unit}</span>
            </>

          }
        }
      ])} />
  }
  return (

    <div className="overflow-x-auto ">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Warehouse</th>
            <th>Alert level</th>
            <th>In Stock</th>
          </tr>
        </thead>
        <tbody>
          {result.isSuccess && result.data.map((v) => (
            <tr key={`${v.product.id}${v.productVariantId ?? ""}`}>
              <th>{v.product.code}</th>
              <td>{getProductFormatedName(v)}</td>
              <td>{v.warehouse.name}</td>
              <td>{v.product.stockAlert}<span className="ml-1 text-sm text-orange-400">{v.product.productUnit?.shortName}</span></td>
              <td> {v._sum.qty}<span className=" ml-1 text-sm text-orange-400">{v.product.productUnit?.shortName}</span></td>
            </tr>))}
        </tbody>
      </table>
    </div>

  );
}
