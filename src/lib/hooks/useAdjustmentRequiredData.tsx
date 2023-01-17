import { useCallback, useMemo } from 'react';
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useAdjustment } from "@/lib/hooks/useAdjustment";
import { ParsedUrlQuery } from 'querystring';

export interface PathProps extends ParsedUrlQuery {
    adjustmentId: string;
}
export function useAdjustmentRequiredData() {
    const { data, isLoading } = useAppConfig();
    const idString = (data.router.query as PathProps).adjustmentId;
    const adjustmentId = useMemo(() => idString ? parseInt(idString) : -1, [idString]);
    const [adjustment, loading, success, r8] = useAdjustment(adjustmentId);
    const refetch = useCallback(() => {
        return Promise.allSettled([r8(), data.refetch()]);
    }, [r8]);
    return { data: { adjustment, ...data, refetch, loading }, isLoading: isLoading || loading };
}
