import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import useRequireAuth from "@/lib/useRequireAuth";
import { useTenant } from "@/lib/hooks/useTenant";
import { getLayout } from "@/layouts/getLayout";
import { FormContainer } from "@/components/FormContainer";
import { FormSection } from "@/components/FormSection";
import { useThemesList } from "@/lib/hooks/useThemesList";
import { useEffect } from "react";
import { useChangeTheme } from "@/lib/hooks/useChangeTheme";
import { BsGraphUp } from "react-icons/bs";




function TenantIndex() {
    const router = useRouter();
    const session = useRequireAuth();
    
    

    if (router.isFallback /* || loading */ ) return <Loader />;
    return (
        <div className="flex flex-col h-fit w-full gap-8">
            {/* stats section */}
            <div className="grid grid-flow-row md:grid-flow-col gap-4">
             {[1,2,3,4].map((v)=>
            <div key={v} className=" stats shadow-md">
             <div className="stat">
                <div className="stat-figure text-primary">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg> */}
                    <BsGraphUp  size={60}/>
                </div>
                <div className="stat-title">Sales</div>
                <div className="stat-value text-primary">25.6K</div>
                <div className="stat-desc">21% more than last month</div>
            </div> 
            </div>          
            )}
        </div>
            {/* sales and purchases */}
            <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
                <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
                    <h2>sales and purchases</h2>
                </div>
                <div className="h-[340px] shadow-md rounded-xl md:col-span-2 p-3">
                 <h2>Top selling product</h2>
                </div>
            </div>

             {/* Stock alerts & top selling this month */}
             <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-5 gap-4">
                <div className="h-[340px] shadow-md rounded-xl md:col-span-3 p-3">
                    <h2>Stock alerts</h2>
                </div>
                <div className="h-[340px] shadow-md rounded-xl md:col-span-2 p-3">
                 <h2>Top selling product (February)</h2>
                </div>
            </div>
            <div className="flex flex-row h-[340px] shadow-md rounded-xl">
            <h2>Recent sales</h2>
            </div>
        </div>
    );
}

export default TenantIndex;
TenantIndex.getLayout = getLayout;


