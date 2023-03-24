import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useSetting } from "@/lib/hooks/useSetting";

export function TopCustomers({
  startDate, endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.topCustomers.useQuery({
    startDate,
    endDate,
    take: 5,
  });

  const { setting } = useSetting();
  const fmt = new Intl.NumberFormat(undefined);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>phone</th>
            <th>Amount</th>

          </tr>
        </thead>
        <tbody>
          {result.isSuccess
            && result.data.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.phone}</td>
                <td>{fmt.format(v._sum.grandTotal ?? 0)}<span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol ?? ""}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
