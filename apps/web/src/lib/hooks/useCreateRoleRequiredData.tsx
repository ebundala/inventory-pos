import { usePermissionsList } from "@/lib/hooks/usePermissionsList";


export function useCreateRoleRequiredData() {
  const { permissions, isLoading } = usePermissionsList();
  return { data: { permissions }, isLoading };
}
