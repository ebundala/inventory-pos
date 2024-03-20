import { useRolesList } from "./useRolesList";



export function useRolesRequiredData() {
    // const config = useAppConfig();
    const roles = useRolesList();
    return { data: { ...roles }, isLoading: roles.isLoading };
}
