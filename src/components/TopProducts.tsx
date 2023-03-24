import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useSetting } from "@/lib/hooks/useSetting";

export function TopProducts({
  startDate, endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.productTopSellers.useQuery({
    startDate,
    endDate,
    take: 10,
  });
  const { setting } = useSetting();
  const fmt = new Intl.NumberFormat(undefined);
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {result.isSuccess && result.data.map((v) => (
            <tr key={v.productId}>
              <td>{v.product.name}</td>
              <td>{v._sum.quantity}
                <span className="text-sm text-orange-400 ml-1">{v.product.productUnit?.shortName}</span></td>

              <td>{fmt.format(v._sum.total ?? 0)}
                <span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol ?? ""}</span></td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
