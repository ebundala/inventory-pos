import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useBrands() {
  const [brands, setBrands] = useStore((s) => s.brands);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.brand.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    if(result.isSuccess){
    setBrands({ brands: result.data ?? null });
    }
  }, [result.isSuccess, setBrands, result.data]);

  return [brands, result.isLoading, result.isSuccess] as [typeof brands, boolean, boolean];
}
