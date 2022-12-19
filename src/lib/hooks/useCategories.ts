import { useStore } from "@/lib/context";
import { useEffect } from "react";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useTenant } from "@/lib/hooks/useTenant";


export function useCategories() {
  const [categories, setCategories] = useStore((s) => s.categories);
  const [tenant] = useTenant();
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.product.category.search.useQuery({ where: { tenantId: tenant?.tenantId } });
  useEffect(() => {
    setCategories({ categories: result.data ?? null });
  }, [result.isSuccess, setCategories, result.data]);

  return [categories, result.isFetching, result.isSuccess] as [typeof categories, boolean, boolean];
}
