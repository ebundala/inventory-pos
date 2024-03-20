import { useRouter } from "next/router";
import { useTenant } from "@/lib/hooks/useTenant";
import { useSetting } from "@/lib/hooks/useSetting";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

export function useAppConfig() {
    const router = useRouter();
    const {tenant,refetch:r0, result:{isLoading:tenantLoading}, } = useTenant();
    const {setting, refetch:r1, result:{isLoading:loadingSettings,}} = useSetting();
 
    const { data, status } = useSession();
    const userLoading = status === "loading";
    const user = useMemo(() => data?.user ?? null, [data]);


    const isLoading = userLoading || tenantLoading || loadingSettings || router.isFallback
    const refetch = () => {
        return Promise.allSettled([r0(),r1()]);
    };

    return {
        data: {
            user,
            tenant,        
            defaultWarehouse:setting?.warehouse,
            defaultCurrency:setting?.currency,
            defaultCustomer:setting?.customer,        
            setting, 
            router,
            refetch
        }, isLoading
    };
}
export type TAppConfig = ReturnType<typeof useAppConfig>['data']


