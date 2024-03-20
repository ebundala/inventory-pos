import { useRouter } from "next/router";
import { usePermissionsList } from "@/lib/hooks/usePermissionsList"
import { useRole } from "@/lib/hooks/useRole";
import { ParsedUrlQuery } from "querystring";

export interface RolePathProps extends ParsedUrlQuery {
  role: string;
}
export function useRoleRequiredData() {
  const router = useRouter();
  const roleName = (router.query as RolePathProps).role ?? "";
  const { role, result, refetch } = useRole(roleName);
  const { permissions, isLoading } = usePermissionsList();
  return { data: { role, permissions, refetch, result, isLoading: result.isLoading || isLoading }, isLoading: result.isLoading || isLoading };

}
