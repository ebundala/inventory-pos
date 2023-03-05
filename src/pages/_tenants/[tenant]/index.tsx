import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import useRequireAuth from "@/lib/useRequireAuth";
import { getLayout } from "@/layouts/getLayout";
import {
  BsArrowBarLeft,
  BsArrowBarRight,
  BsBarChart,
  BsGraphUp,
} from "react-icons/bs";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import LoadingDots from "@/components/app/loading-dots";
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
  Legend,
} from "recharts";
import { useSales } from "@/lib/hooks/useSales";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { calculateStock } from "@/lib/util/calculateStock";
import { useSetting } from "@/lib/hooks/useSetting";

function SalesStats({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.sales.useQuery({
    startDate,
    endDate,
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
  });
  const desc =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div className=" stats shadow-md">
      <div className="stat">
        <div className="stat-figure text-primary">
          <BsGraphUp size={48} />
        </div>
        <div className="stat-title">Sales</div>
        <div className="stat-value text-xl  text-primary">
          {result.isSuccess
            ? formater.format(
                result.data.reduce((p, c) => p + (c?._sum.grandTotal ?? 0), 0)
              )
            : ""}
        </div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}

function PurchasesStats({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.purchases.useQuery({
    startDate,
    endDate,
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
  });
  const desc =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div className=" stats shadow-md">
      <div className="stat">
        <div className="stat-figure text-primary">
          <BsBarChart size={48} />
        </div>
        <div className="stat-title">Purchases</div>
        <div className="stat-value text-xl  text-primary">
          {result.isSuccess
            ? formater.format(
                result.data.reduce((p, c) => p + (c?._sum.grandTotal ?? 0), 0)
              )
            : ""}
        </div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}

function SaleReturnStats({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.saleReturns.useQuery({
    startDate,
    endDate,
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
  });
  const desc =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div className=" stats shadow-md">
      <div className="stat">
        <div className="stat-figure text-primary">
          <BsArrowBarRight size={48} />
        </div>
        <div className="stat-title">Sale returns</div>
        <div className="stat-value text-xl  text-primary">
          {result.isSuccess
            ? formater.format(
                result.data.reduce((p, c) => p + (c?._sum.grandTotal ?? 0), 0)
              )
            : ""}
        </div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}

function PurchaseReturnStats({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.purchaseReturns.useQuery({
    startDate,
    endDate,
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
  });
  const desc =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  return (
    <div className=" stats shadow-md">
      <div className="stat">
        <div className="stat-figure text-primary">
          <BsArrowBarLeft size={48} />
        </div>
        <div className="stat-title">Purchase returns</div>
        <div className="stat-value text-xl text-primary">
          {result.isSuccess
            ? formater.format(
                result.data.reduce((p, c) => p + (c?._sum.grandTotal ?? 0), 0)
              )
            : ""}
        </div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}
function getDateKey(date: Date) {
  return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}
function SalesAndPurchases({
  startDate,
  endDate,
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
function PaymentsSentAndReceived({
  startDate,
  endDate,
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
              Prisma.PaymentPurchaseGroupByOutputType,
              "date"[]
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
function TopProducts({
  startDate,
  endDate,
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
  const {setting} = useSetting();
  const fmt = new Intl.NumberFormat(undefined)
  console.log(startDate,endDate);
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
        {result.isSuccess&&result.data.map((v)=>(
        <tr key={v.productId}>
          <td>{v.product.name}</td>
          <td>{v._sum.quantity}
          <span className="text-sm text-orange-400 ml-1">{v.product.productUnit?.shortName}</span></td>

          <td>{fmt.format(v._sum.total??0)}
          <span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol??""}</span></td>
        </tr>))
        }
      </tbody>
     </table>
    </div>
  );
}
function TopCustomers({
  startDate,
  endDate,
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

  const {setting} = useSetting();
  const fmt = new Intl.NumberFormat(undefined)
  
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
            <td>{fmt.format(v._sum.grandTotal??0)}<span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol??""}</span>
            </td>
          </tr>
        ))
        }
        </tbody>
      </table>
    </div>
  );
}

function RecentSales() {
  const { result } = useSales({
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  });
  const {setting} = useSetting();
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
          <td>{fmt.format(v.grandTotal??0)}<span className="text-sm text-orange-400 ml-1">{setting?.currency?.symbol??""}</span></td>
          <td>{v.status}</td>
          
        </tr>)
        }
        </tbody>
      </table>
    </div>
  );
}

function StockAlerts() {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.stockAlerts.useQuery();
  if(result.isLoading) return null
  
  
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
          <tr key={`${v.product.id}${v.productVariantId??""}`}>
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

function useTodayDateRange() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month, day, 23, 59, 59);
  return [startDate, endDate];
}
function useThisMonthDateRange() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return [startDate, endDate];
}

function useThisYearDateRange() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11 + 1, 0);
  return [startDate, endDate];
}

function useGetDateRanges(start: Date, end: Date) {
  const dates: Date[] = [];
  const temp = new Date(start);
  dates.push(start);
  while (temp < end) {
    temp.setUTCDate(temp.getUTCDate() + 1);
    dates.push(new Date(temp));
  }
  return dates;
}
function useGetDaysAgo(end: Date, days: number) {
  const dates: Date[] = [];
  const startDate = new Date(end);
  for (let i = 0; i < days; i++) {
    startDate.setUTCDate(startDate.getUTCDate() - 1);
  }
  return [startDate, end];
}

function TenantIndex() {
  const router = useRouter();
  const session = useRequireAuth();

  const [mStartDate, mEndDate] = useGetDaysAgo(new Date(), 30);
  const [dStart, dEnd] = useTodayDateRange();
  const [yStart, yEnd] = useThisYearDateRange();
  const [wStart, wEnd] = useGetDaysAgo(new Date(), 7);

  if (router.isFallback /* || loading */) return <Loader />;
  return (
    <div className="flex flex-col h-fit w-full gap-8">
      {/* stats section */}
      <div className="grid grid-flow-row md:grid-flow-col gap-4">
        <SalesStats startDate={dStart} endDate={dEnd} />
        <PurchasesStats startDate={dStart} endDate={dEnd} />
        <SaleReturnStats startDate={dStart} endDate={dEnd} />
        <PurchaseReturnStats startDate={dStart} endDate={dEnd} />
      </div>
      {/* sales and purchases */}
      <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
        <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
          <h2 className="font-bold text-lg mb-2">Sales and Purchases</h2>
          <div className="text-xs p-4 w-full h-full overflow-x-auto">
            <SalesAndPurchases startDate={wStart} endDate={wEnd} />
          </div>
        </div>
        <div className="min-h-[340px] h-fit shadow-md rounded-xl md:col-span-2 p-3">
          <h2 className="font-bold text-lg mb-2">
            Top selling product ({new Date().getFullYear()})
          </h2>
          <TopProducts startDate={yStart} endDate={yEnd} />
        </div>
      </div>

      {/* Stock alerts & top selling this month */}
      <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
        <div className="min-h-[340px] h-fit shadow-md rounded-xl md:col-span-3 p-3">
          <h2 className="font-bold text-lg mb-2">Stock alerts</h2>
          <StockAlerts />
        </div>
        <div className="min-h-[340px] h-fit shadow-md rounded-xl md:col-span-2 p-3">
          <h2 className="font-bold text-lg mb-2">
            Top selling product ({new Date().toLocaleString("default", { month: "long" })})
          </h2>
          <TopProducts startDate={mStartDate} endDate={mEndDate} />
        </div>
      </div>
      {/* payment sent and received */}
      <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
        <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
          <h2 className="font-bold text-lg mb-2">Payment sent and received</h2>
          <div className="text-xs p-4 w-full h-full overflow-x-auto">
            <PaymentsSentAndReceived startDate={wStart} endDate={wEnd} />
          </div>
        </div>
        <div className="min-h-[340px] h-fit shadow-md rounded-xl md:col-span-2 p-3">
          <h2 className="font-bold text-lg mb-2">Top customers ({new Date().toLocaleString("default", { month: "long" })})</h2>
          <TopCustomers startDate={mStartDate} endDate={mEndDate} />
        </div>
      </div>
      {/* recent sales */}
      <div className="flex flex-col min-h-[340px] h-fit shadow-md rounded-xl p-3    ">
        <h2 className="font-bold text-lg mb-2">Recent sales</h2>
        <RecentSales />
      </div>
    </div>
  );
}

export default TenantIndex;
TenantIndex.getLayout = getLayout;
