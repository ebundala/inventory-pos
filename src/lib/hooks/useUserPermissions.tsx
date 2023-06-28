import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";
import { useCallback } from "react";


export function useUserPermissions() {
    const [userPermissions, setUserPermissions] = useStore((s) => s.userPermissions);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getUserPermissions.useQuery(undefined,
        {
            onSuccess(data) {
                setUserPermissions({ userPermissions: data ?? [] });
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setUserPermissions({ userPermissions: rResult.data ?? [] });
        }
        return rResult;
    }, [result.refetch]);


    return { userPermissions, result, refetch, isLoading: result.isLoading };
}
