import { useStore } from "@/lib/context";
import { useCallback, useMemo } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";
import { z } from "zod";
import { AdjustmentFindManySchema } from "prisma/generated/schemas/findManyAdjustment.schema";
import { SaleFindManySchema } from "prisma/generated/schemas/findManySale.schema";
import { QuotationFindManySchema } from "prisma/generated/schemas/findManyQuotation.schema";
import { SaleReturnFindManySchema } from "prisma/generated/schemas/findManySaleReturn.schema";
import { PurchaseReturnFindManySchema } from "prisma/generated/schemas/findManyPurchaseReturn.schema";
import { TransferFindManySchema } from "prisma/generated/schemas/findManyTransfer.schema";



export function useQuotations(args?: z.infer<typeof QuotationFindManySchema>) {
    const [quotations, setValue] = useStore((s) => s.quotations);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();

    const options = useMemo(() => {
        const { where, ...rest } = args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.quotation.search.useQuery(
        options,
        {
            onSuccess(data) {
                setValue({ quotations: data ?? null });
            },
        });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setValue({ quotations: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [quotations, result.isLoading, result.isSuccess, refetch] as [typeof quotations, boolean, boolean, typeof refetch];
}

export function useTransfers(args?: z.infer<typeof TransferFindManySchema>) {
    const [transfers, setValue] = useStore((s) => s.transfers);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();

    const options = useMemo(() => {
        const { where, ...rest } =args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.transfer.search.useQuery(
        options,
        {
            onSuccess(data) {
                setValue({ transfers: data ?? null });
            },
        });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setValue({ transfers: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [transfers, result.isLoading, result.isSuccess, refetch] as [typeof transfers, boolean, boolean, typeof refetch];
}
// export function usePurchaseReturns(args?: z.infer<typeof PurchaseReturnFindManySchema>) {
//     const [purchaseReturns, setValue] = useStore((s) => s.purchaseReturns);
//     const [tenant] = useTenant();
//     const trpcWithHost = useTrpcTenant();

//     const options = useMemo(() => {
//         const { where, ...rest } =args??{};
//         return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
//     }, [args, tenant]);

//     const result = trpcWithHost.purchaseReturn.search.useQuery(
//         options,
//         {
//             onSuccess(data) {
//                 setValue({ sales: data ?? null });
//             },
//         });
//     const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
//         const rResult = await result.refetch(opts);
//         if (rResult.isSuccess) {
//             setValue({ sales: rResult.data ?? null })
//         }
//         return rResult;
//     }, [result.refetch])

//     return [purchaseReturns, result.isLoading, result.isSuccess, refetch] as [typeof purchaseReturns, boolean, boolean, typeof refetch];
// }
// export function useSaleReturns(args?: z.infer<typeof SaleReturnFindManySchema>) {
//     const [saleReturns, setValue] = useStore((s) => s.saleReturns);
//     const [tenant] = useTenant();
//     const trpcWithHost = useTrpcTenant();

//     const options = useMemo(() => {
//         const { where, ...rest } =args??{};
//         return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
//     }, [args, tenant]);

//     const result = trpcWithHost.saleReturn.search.useQuery(
//         options,
//         {
//             onSuccess(data) {
//                 setValue({ sales: data ?? null });
//             },
//         });
//     const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
//         const rResult = await result.refetch(opts);
//         if (rResult.isSuccess) {
//             setValue({ sales: rResult.data ?? null })
//         }
//         return rResult;
//     }, [result.refetch])

//     return [saleReturns, result.isLoading, result.isSuccess, refetch] as [typeof saleReturns, boolean, boolean, typeof refetch];
// }




export function useSales(args?: z.infer<typeof SaleFindManySchema>) {
    const [sales, setSales] = useStore((s) => s.sales);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();

    const options = useMemo(() => {
        const { where, ...rest } =args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.sale.search.useQuery(
        options,
        {
            onSuccess(data) {
                setSales({ sales: data ?? null });
            },
        });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setSales({ sales: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [sales, result.isLoading, result.isSuccess, refetch] as [typeof sales, boolean, boolean, typeof refetch];
}

export function useAdjustments(args?: z.infer<typeof AdjustmentFindManySchema>) {
    const [adjustments, setAdjustments] = useStore((s) => s.adjustments);
    const [tenant] = useTenant();
    const trpcWithHost = useTrpcTenant();

    const options = useMemo(() => {
        const { where, ...rest } =args??{};
        return { where: { tenantId: tenant?.tenantId, ...where }, ...rest }
    }, [args, tenant]);

    const result = trpcWithHost.adjustment.search.useQuery(
        options,
        {
            onSuccess(data) {
                setAdjustments({ adjustments: data ?? null });
            },
        });
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setAdjustments({ adjustments: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])

    return [adjustments, result.isLoading, result.isSuccess, refetch] as [typeof adjustments, boolean, boolean, typeof refetch];
}
