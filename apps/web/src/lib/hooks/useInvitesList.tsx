import { useStore } from "@/lib/context";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useCallback } from "react";



export function useInvitesList() {

    const [invites, setInvites] = useStore((s) => s.invites);
    const trpcWithHost = useTrpcTenant();
    const result = trpcWithHost.tenant.findMyInvites.useQuery(undefined, {
        onSuccess: (data) => {
            setInvites({ invites: data });
        }
    });
    const refetch = useCallback(async () => {
        const rResult = await result.refetch();
        if (result.isSuccess) {
            setInvites({ invites: rResult.data });
        }
    }, [result.refetch]);

    return { invites, result, refetch };
}
