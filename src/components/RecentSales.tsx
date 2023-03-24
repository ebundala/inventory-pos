import { Prisma } from "@prisma/client";
import { useSales } from "@/lib/hooks/useSales";
import { useSetting } from "@/lib/hooks/useSetting";

export function RecentSales() {
  const { result } = useSales({
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  });
  const { setting } = useSetting();
  const fmt = new Intl.NumberFormat(undefined);
  const fmt2 = new Intl.DateTimeFormat();

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>

          </tr>
        </thead>
        <tbody>
          {result.isSuccess
            && result.data.map((v) => <tr key={v.id}>
              <td>{v.ref}</td>
              <td>{fmt2.format(v.date)}</td>
              <td>{v.customer.name}</td>
              <td>{fmt.format(v.grandTotal ?? 0)}<span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol ?? ""}</span></td>
              <td>{v.status}</td>

            </tr>)}
        </tbody>
      </table>
    </div>
  );
}
