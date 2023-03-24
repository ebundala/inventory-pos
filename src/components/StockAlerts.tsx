import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";

export function StockAlerts({take,skip}:{take?:number,skip?:number}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.stockAlerts.useQuery({take:take,skip:skip});
  if (result.isLoading)
    return null;


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
