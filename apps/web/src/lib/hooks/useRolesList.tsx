import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";
import { useCallback } from "react";


export function useRolesList() {
    const [roles, setRoles] = useStore((s) => s.roles);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getRoles.useQuery(undefined,
        {
            onSuccess(data) {
                setRoles({ roles: data ?? [] });
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setRoles({ roles: rResult.data ?? [] });
        }
        return rResult;
    }, [result.refetch]);


    return { roles, result, refetch, isLoading: result.isLoading };
}
