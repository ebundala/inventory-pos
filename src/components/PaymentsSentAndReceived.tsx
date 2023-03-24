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

export function PaymentsSentAndReceived({
  startDate, endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const dates = useGetDateRanges(startDate, endDate);
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.paymentSale.useQuery({
    startDate,
    endDate,
  });
  const result1 = trpcTenant.report.paymentPurchase.useQuery({
    startDate,
    endDate,
  });
  const result2 = trpcTenant.report.paymentSaleReturns.useQuery({
    startDate,
    endDate,
  });
  const result3 = trpcTenant.report.paymentPurchaseReturn.useQuery({
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
            Prisma.PickArray<Prisma.PaymentSaleGroupByOutputType, "date"[]> & {
              _sum: {
                amount: number | null;
              };
            }
          >()
        );
        const dataMap1 = data1.reduce(
          (p, c, i) => p.set(getDateKey(c.date), c),
          new Map<
            string,
            Prisma.PickArray<
              Prisma.PaymentPurchaseGroupByOutputType, "date"[]
            > & {
              _sum: {
                amount: number | null;
              };
            }
          >()
        );

        return dates.map((d) => {
          const v = dataMap.get(getDateKey(d));
          const v1 = dataMap1.get(getDateKey(d));
          let Received = 0;
          let Sent = 0;
          if (v) {
            Received = v._sum.amount || 0;
          }
          if (v1) {
            Sent = v1._sum.amount || 0;
          }
          return { date: d.toLocaleDateString(), Received, Sent };
        });
      }
      return [];
    }
  }, [dates, result.data, result.isSuccess, result1.data, result1.isSuccess]);

  return (
    <ResponsiveContainer>
      <LineChart data={data}>
        <Line type="monotone" dataKey="Received" stroke="orange"></Line>
        <Line type="monotone" dataKey="Sent" stroke="blue"></Line>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date"></XAxis>
        <YAxis></YAxis>
      </LineChart>
    </ResponsiveContainer>
  );
}
