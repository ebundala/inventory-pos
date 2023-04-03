import { useRouter } from "next/router";
import { getLayout } from "@/layouts/getLayout";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useSession } from "next-auth/react";
import { StockAlerts } from "@/components/StockAlerts";
import { RecentSales } from "@/components/RecentSales";
import { TopCustomers } from "@/components/TopCustomers";
import { TopProducts } from "@/components/TopProducts";
import { PaymentsSentAndReceived } from "@/components/PaymentsSentAndReceived";
import { SalesAndPurchases } from "@/components/SalesAndPurchases";
import { PurchaseReturnStats } from "@/components/PurchaseReturnStats";
import { SaleReturnStats } from "@/components/SaleReturnStats";
import { PurchasesStats } from "@/components/PurchasesStats";
import { SalesStats } from "@/components/SalesStats";
import { useTodayDateRange } from "@/lib/hooks/useTodayDateRange";
import { useThisYearDateRange } from "@/lib/hooks/useThisYearDateRange";
import { useGetDaysAgo } from "@/lib/hooks/useGetDaysAgo";
import Link from "next/link";

function useTenantIndexRequiredData() {
  const router = useRouter();
  const { data, status } = useSession();
  return { data, isLoading: router.isFallback || status === "loading" }
}
type TenantIndexProps = ReturnType<typeof useTenantIndexRequiredData>
function TenantIndex({ data, isLoading }: TenantIndexProps) {


  const [mStartDate, mEndDate] = useGetDaysAgo(new Date(), 30);
  const [dStart, dEnd] = useTodayDateRange();
  const [yStart, yEnd] = useThisYearDateRange();
  const [wStart, wEnd] = useGetDaysAgo(new Date(), 7);

  return (
    <div className="flex flex-col h-fit w-full gap-8">
      {/* stats section */}
      <div className="grid grid-flow-row md:grid-flow-col gap-4">
        <Link href={"/sales"}>
          <SalesStats  startDate={dStart} endDate={dEnd} />
        </Link>
        <Link href={"/purchases"}>
          <PurchasesStats startDate={dStart} endDate={dEnd} />
        </Link>
        <Link href={"/sale-returns"}><SaleReturnStats startDate={dStart} endDate={dEnd} /></Link>
        <Link href={"/purchase-returns"}><PurchaseReturnStats startDate={dStart} endDate={dEnd} /></Link>
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
          <StockAlerts take={1} skip={0} />
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



export default function Index() {

  return (

    <CollectRequiredDataWrapper useHooks={useTenantIndexRequiredData}>
      {(props) => <TenantIndex {...props} />}
    </CollectRequiredDataWrapper>
  );
}
Index.getLayout = getLayout;