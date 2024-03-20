import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useStore } from "@/lib/context";
import { useCallback } from "react";


export function useRole(roleName: string) {
    const [role, setRole] = useStore((s) => s.editingRole);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getRole.useQuery(roleName,
        {
            onSuccess(data) {
                setRole({ editingRole: data ?? null });
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setRole({ editingRole: rResult.data ?? null });
        }
        return rResult;
    }, [result.refetch]);


    return { role, result, refetch, isLoading: result.isLoading };
}
