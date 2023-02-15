import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import useRequireAuth from "@/lib/useRequireAuth";
import { getLayout } from "@/layouts/getLayout";
import { BsArrowBarLeft, BsArrowBarRight, BsBarChart, BsGraphUp } from "react-icons/bs";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import LoadingDots from "@/components/app/loading-dots";
import { useMemo } from "react";
import { Prisma } from "@prisma/client";
import {LineChart,Line,CartesianGrid,XAxis,YAxis,ResponsiveContainer } from "recharts"

function SalesStats({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.sales.useQuery({
        startDate,endDate
    });
   const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short"})
   const desc = startDate.toLocaleDateString() === endDate.toLocaleDateString()?startDate.toLocaleDateString():`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

   return (
        <div  className=" stats shadow-md">
             <div className="stat">
                <div className="stat-figure text-primary">
                    <BsGraphUp  size={48}/>
                </div>
                <div className="stat-title">Sales</div>
                <div className="stat-value text-xl  text-primary">{result.isSuccess?formater.format(result.data.reduce((p,c)=>p+(c?._sum.grandTotal??0),0)):""}</div>
                <div className="stat-desc">{desc}</div>
            </div> 
            </div> 
    );
}


function PurchasesStats({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.purchases.useQuery({
        startDate,endDate
    });
    const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short"})
    const desc = startDate.toLocaleDateString() === endDate.toLocaleDateString()?startDate.toLocaleDateString():`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    return (
        <div  className=" stats shadow-md">
             <div className="stat">
                <div className="stat-figure text-primary">
                <BsBarChart size={48} />
                </div>
                <div className="stat-title">Purchases</div>
                <div className="stat-value text-xl  text-primary">{result.isSuccess?formater.format(result.data.reduce((p,c)=>p+(c?._sum.grandTotal??0),0)):""}</div>
                <div className="stat-desc">{desc}</div>
            </div> 
            </div> 
    );
}

function SaleReturnStats({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.saleReturns.useQuery({
        startDate,endDate
    });
    const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short"})
    const desc = startDate.toLocaleDateString() === endDate.toLocaleDateString()?startDate.toLocaleDateString():`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    return (
        <div  className=" stats shadow-md">
             <div className="stat">
                <div className="stat-figure text-primary">
                <BsArrowBarRight size={48} />
                </div>
                <div className="stat-title">Sale returns</div>
                <div className="stat-value text-xl  text-primary">{result.isSuccess?formater.format(result.data.reduce((p,c)=>p+(c?._sum.grandTotal??0),0)):""}</div>
                <div className="stat-desc">{desc}</div>
            </div> 
            </div> 
    );
}

function PurchaseReturnStats({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.purchaseReturns.useQuery({
        startDate,endDate
    });
    const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short"})
     const desc = startDate.toLocaleDateString() === endDate.toLocaleDateString()?startDate.toLocaleDateString():`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    return (
        <div  className=" stats shadow-md">
             <div className="stat">
                <div className="stat-figure text-primary">
                <BsArrowBarLeft size={48} />
                </div>
                <div className="stat-title">Purchase returns</div>
                <div className="stat-value text-xl text-primary">{result.isSuccess?formater.format(result.data.reduce((p,c)=>p+(c?._sum.grandTotal??0),0)):""}</div>
                <div className="stat-desc">{desc}</div>
            </div> 
            </div> 
    );
}
function getDateKey(date:Date){
    return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
}
function SalesAndPurchases({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const dates = useGetDateRanges(startDate,endDate);
    const result = trpcTenant.report.sales.useQuery({
        startDate,endDate
    });
    const result1 = trpcTenant.report.purchases.useQuery({
        startDate,endDate
    });
    const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:0})
    const data=useMemo(()=>{
        if(result.isSuccess && result1.isSuccess){
            const data = result.data;
            const data1 = result1.data;
            if(data.length>0){
           const dataMap= data.reduce((p,c,i)=>p.set(getDateKey(c.date),c),new Map<string,(Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
                _sum: {
                    grandTotal: number | null;
                };
            })>());
            const dataMap1= data1.reduce((p,c,i)=>p.set(getDateKey(c.date),c),new Map<string,(Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
                _sum: {
                    grandTotal: number | null;
                };
            })>());

          return dates.map((d)=>{
            const v = dataMap.get(getDateKey(d));
            const v1 = dataMap1.get(getDateKey(d))
            let sale = 0;
            let purchase = 0;
            if(v){
                sale=v._sum.grandTotal||0;
            }
            if(v1){
                purchase=v1._sum.grandTotal||0;
            }
            return {date:d.toLocaleDateString(),sale,purchase};
           })

            }
            return [];
        }
    },[dates,result.data,result.isSuccess,result1.data,result1.isSuccess])
  
    return(
        <ResponsiveContainer>
        <LineChart data={data} >
            <Line type="monotone" dataKey="sale" stroke="#8884d8"></Line>
            <Line type="monotone" dataKey="purchase" stroke="#1CF1d8"></Line>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date"></XAxis>
            <YAxis></YAxis>
        </LineChart>
       </ResponsiveContainer>
  );
}
function PaymentsSentAndReceived({startDate,endDate}:{startDate:Date,endDate: Date}){
    const dates = useGetDateRanges(startDate,endDate);
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.paymentSale.useQuery({
        startDate,endDate
    });
    const result1 = trpcTenant.report.paymentPurchase.useQuery({
        startDate,endDate
    });
    const result2 = trpcTenant.report.paymentSaleReturns.useQuery({
        startDate,endDate
    });
    const result3 = trpcTenant.report.paymentPurchaseReturn.useQuery({
        startDate,endDate
    });
    const formater = new Intl.NumberFormat(undefined,{compactDisplay:"short",maximumFractionDigits:0})
    const data=useMemo(()=>{
        if(result.isSuccess && result1.isSuccess){
            const data = result.data;
            const data1 = result1.data;
            if(data.length>0){
           const dataMap= data.reduce((p,c,i)=>p.set(getDateKey(c.date),c),new Map<string,(Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
                _sum: {
                    grandTotal: number | null;
                };
            })>());
            const dataMap1= data1.reduce((p,c,i)=>p.set(getDateKey(c.date),c),new Map<string,(Prisma.PickArray<Prisma.SaleGroupByOutputType, "date"[]> & {
                _sum: {
                    grandTotal: number | null;
                };
            })>());

          return dates.map((d)=>{
            const v = dataMap.get(getDateKey(d));
            const v1 = dataMap1.get(getDateKey(d))
            let sale = 0;
            let purchase = 0;
            if(v){
                sale=v._sum.grandTotal||0;
            }
            if(v1){
                purchase=v1._sum.grandTotal||0;
            }
            return {date:d.toLocaleDateString(),sale,purchase};
           })

            }
            return [];
        }
    },[dates,result.data,result.isSuccess,result1.data,result1.isSuccess])
 
    return(
        <ResponsiveContainer>
        <LineChart data={data} >
            <Line type="monotone" dataKey="sale" stroke="#8884d8"></Line>
            <Line type="monotone" dataKey="purchase" stroke="#1CF1d8"></Line>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date"></XAxis>
            <YAxis></YAxis>
        </LineChart>
       </ResponsiveContainer>
  );
}
function TopProducts({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.productTopSellers.useQuery({
        startDate,endDate,take:0
    });
  return(
    <>
    {result.isSuccess?JSON.stringify(result.data):""}
    </>
  );
}
function TopCustomers({startDate,endDate}:{startDate:Date,endDate: Date}){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.topCustomers.useQuery({
        startDate,endDate,take:5
    });
  return(
    <>
    {result.isSuccess?JSON.stringify(result.data):""}
    </>
  );
}

function StockAlerts(){
    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.report.stockAlerts.useQuery();
    return (
        <>
         {result.isSuccess?JSON.stringify(result.data):""}
        </>
    );
}

function useTodayDateRange(){
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth();
  const startDate = new Date(year,month,day);
  const endDate = new Date(year,month,day,23,59,59);
  return [startDate,endDate]
}
function useThisMonthDateRange(){
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year,month,1);
    const endDate = new Date(year,month+1,0);
    return [startDate,endDate]
  }

  function useThisYearDateRange(){
    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year,0,1);
    const endDate = new Date(year,11+1,0);
    return [startDate,endDate]
  }

function useGetDateRanges(start:Date,end:Date){    
    const dates:Date[] = [];
    const temp = new Date(start);
    dates.push(start);
     while(temp<end){
        temp.setUTCDate(temp.getUTCDate()+1);
        dates.push(new Date(temp))
     }
return dates;
}

function TenantIndex() {
    const router = useRouter();
    const session = useRequireAuth();
    
    const [mStartDate,mEndDate] = useThisMonthDateRange();    
    const [dStart,dEnd] = useTodayDateRange();
    const [yStart,yEnd] = useThisYearDateRange();
   
   
    if (router.isFallback /* || loading */ ) return <Loader />;
    return (
        <div className="flex flex-col h-fit w-full gap-8">
            {/* stats section */}
            <div className="grid grid-flow-row md:grid-flow-col gap-4">
             <SalesStats startDate={dStart} endDate={dEnd}/>
             <PurchasesStats startDate={dStart} endDate={dEnd} />
             <SaleReturnStats startDate={dStart} endDate={dEnd}/>
             <PurchaseReturnStats startDate={dStart} endDate={dEnd}/>
        </div>
            {/* sales and purchases */}
            <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
                <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
                    <h2>sales and purchases</h2>
                    <SalesAndPurchases startDate={mStartDate} endDate={mEndDate}/>
                </div>
                <div className="h-[340px] shadow-md rounded-xl md:col-span-2 p-3">
                 <h2>Top selling product ({(new Date()).getFullYear()})</h2>
                 <TopProducts startDate={yStart} endDate={yEnd} />
                </div>
            </div>

             {/* Stock alerts & top selling this month */}
             <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
                <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
                    <h2>Stock alerts</h2>
                    <StockAlerts />
                </div>
                <div className="h-[340px] shadow-md rounded-xl md:col-span-2 p-3">
                 <h2>Top selling product ({(new Date()).toLocaleString('default',{month:'long'})})</h2>
                 <TopProducts startDate={mStartDate} endDate={mEndDate} />
                </div>
            </div>
              {/* payment sent and received */}
              <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
                <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
                    <h2>Payment sent and received</h2>
                    <PaymentsSentAndReceived startDate={mStartDate} endDate={mEndDate} />
                </div>
                <div className="h-[340px] shadow-md rounded-xl md:col-span-2 p-3">
                 <h2>Top customers</h2>
                 <TopCustomers startDate={mStartDate} endDate={mEndDate} />
                </div>
            </div>
            {/* recent sales */}
            <div className="flex flex-row h-[340px] shadow-md rounded-xl p-3    ">
            <h2>Recent sales</h2>
            </div>
        </div>
    );
}

export default TenantIndex;
TenantIndex.getLayout = getLayout;


