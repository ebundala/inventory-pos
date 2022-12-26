import { useBrands } from "@/lib/hooks/useBrands";
import { useCategories } from "@/lib/hooks/useCategories";
import { useUnits } from "@/lib/hooks/useUnits";
import { useRouter } from "next/router";
import { useTenant } from "@/lib/hooks/useTenant";
import { useSetting } from "@/lib/hooks/useSetting";
import { useCurrencies } from "@/lib/hooks/useCurrencies";
import { useCallback, useMemo } from "react";
import { useWarehouses } from "@/lib/hooks/useWarehouses";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";
import { useSession } from "next-auth/react";

export function useAppConfig() {
    const router = useRouter();
    const [tenant, tenantLoading, _0, r0] = useTenant();
    const [setting, loadingSettings, _1, r1] = useSetting();
    const [categories, categoryLoading, _2, r2] = useCategories();
    const [brands, brandsLoading, _3, r3] = useBrands();//Todo review brands if needed here
    const [units, unitsLoading, _4, r4] = useUnits();
    const [currencyList, currLoading, _5, r5] = useCurrencies();
    const [warehouseList, warehouseLoading, _6, r6] = useWarehouses();
    const [defaultCustomer, customerLoading, _7, r7] = useDefaultCustomer(setting?.customerId);
    const { data, status } = useSession();
    const userLoading = status == "loading";
    const user = useMemo(() => data?.user ?? null, [data]);

    const { warehouses, defaultWarehouse } = useMemo(() => {
        let defaultWarehouse;
        if (warehouseList && setting && setting?.warehouseId) {
            const id = setting?.warehouseId;
            const index = warehouseList?.findIndex((w) => w.id === id);
            const list = [...warehouseList];
            const el = list.splice(index, 1);
            defaultWarehouse = el.length ? el[0] : null;
            
             return { warehouses: [...el, ...list], defaultWarehouse };
            
        }
        return { warehouses: warehouseList, };
    }, [setting?.warehouseId, warehouseList]);

    const { currencies, defaultCurrency } = useMemo(() => {
        let defaultCurrency;
        if (currencyList && setting && setting?.currencyId) {
            const id = setting?.currencyId;
            const index = currencyList?.findIndex((w) => w.id === id);
            const list = [...currencyList];
            const el = list.splice(index, 1);
            defaultCurrency = el.length ? el[0] : null;
            return { currencies: [...el, ...list], defaultCurrency };
        }
        return { currencies: currencyList, };
    }, [setting?.currencyId, currencyList]);


    const isLoading = userLoading || customerLoading || currLoading || warehouseLoading || tenantLoading || loadingSettings || categoryLoading || brandsLoading || unitsLoading || router.isFallback
    const refetch = () => {
        return Promise.allSettled([r0(), r2(), r2(), r3(), r4(), r5, r6(), r7()]);
    };
    return {
        data: {
            user,
            tenant,
            categories,
            currencies,
            warehouses,
            brands,
            defaultCustomer,
            defaultWarehouse,
            defaultCurrency,
            units, setting, router, refetch
        }, isLoading
    };
}
export type TAppConfig = ReturnType<typeof useAppConfig>['data']


function useDefaultCustomer(id?: number | null) {
    const [customer, setValue] = useStore((s) => s.defaultCustomer);

    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.people.get.useQuery(
        id ?? -1, {
        onSuccess(data) {
            setValue({ defaultCustomer: data ?? null });
        },
    });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setValue({ defaultCustomer: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [customer, result.isLoading, result.isSuccess, refetch] as [typeof customer, boolean, boolean, typeof refetch];

}