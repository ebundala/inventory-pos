import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useMemo } from "react";
import { Prisma } from "@prisma/client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { getDateKey } from "@/lib/util/getDateKey";
import { useGetDateRanges } from "@/lib/hooks/useGetDateRanges";

export function SalesAndPurchases({
  startDate, endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const dates = useGetDateRanges(startDate, endDate);
  const result = trpcTenant.report.sales.useQuery({
    startDate,
    endDate,
  });
  const result1 = trpcTenant.report.purchases.useQuery({
    startDate,
    endDate,
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
    maximumFractionDigits: 0,
  });
  const data = useMemo(() => {
    if (result.isSuccess && result1.isSuccess) {
      const data = result.data;
      const data1 = result1.data;
      if (data.length > 0) {
        const dataMap = data.reduce(
          (p, c, i) => p.set(getDateKey(c.date), c),
          new Map<
            string,
            Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
              _sum: {
                grandTotal: number | null;
              };
            }
          >()
        );
        const dataMap1 = data1.reduce(
          (p, c, i) => p.set(getDateKey(c.date), c),
          new Map<
            string,
            Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
              _sum: {
                grandTotal: number | null;
              };
            }
          >()
        );

        return dates.map((d) => {
          const v = dataMap.get(getDateKey(d));
          const v1 = dataMap1.get(getDateKey(d));
          let Sales = 0;
          let Purchases = 0;
          if (v) {
            Sales = v._sum.grandTotal || 0;
          }
          if (v1) {
            Purchases = v1._sum.grandTotal || 0;
          }
          return { date: d.toLocaleDateString(), Sales, Purchases };
        });
      }
      return [];
    }
  }, [dates, result.data, result.isSuccess, result1.data, result1.isSuccess]);

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <Line type="monotone" dataKey="Sales" stroke="green"></Line>
        <Line type="monotone" dataKey="Purchases" stroke="orange"></Line>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <XAxis dataKey="date" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  );
}
