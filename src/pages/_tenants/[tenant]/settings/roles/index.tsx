import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useAdjustments } from "@/lib/hooks/useAdjustments";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { useStore } from "@/lib/context";
import { useCallback } from "react";
import { TPermission, TRoleWithPermision } from "@/core/authorization";
import { useRouter } from "next/router";


function Roles({roles,refetch}:RolesProps) {
   const router = useRouter();
   const trpcTenant = useTrpcTenant();
   const {showProgress,callbacks}= useProgressFeedback()
   const dResult =  trpcTenant.authorization.deleteRole.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
   const showConfirmDialog = useConfirmDialog({message:"You are about to delete this record. This action cannot be reversed, Do you want to continue?"})
     
    return (
    <FormContainer title={<h2>Roles</h2>}>
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    () => {

                     router.push("/settings/roles/create");
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={roles ?? []}
            collumsData={() => {

                return [
                    {
                        Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        ,
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: () => {
                            return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        }
                    },
                   
                    {
                        Header: "Role",
                        accessor: "role"
                    },
                    {
                        Header: "Permissions",
                        accessor: "permissions",
                        Cell: ({value}:{value:TPermission[]}) => {
                            return value.length
                        }

                    },
                    
                    {
                        Header: "",
                        accessor: "spacing",
                        disableSortBy: true,

                    },
                    
                    {
                        Header: "Actions",
                        accessor: "id",
                        disableSortBy: true,
                        Cell: ({ row }: { row: any}) => {
                            const value = row.original as TRoleWithPermision;
                            return <div className="flex flex-row gap-2">
                                <button onClick={() => {
                                    router.push(`/settings/roles/view/${value.role}`);

                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                <button onClick={() => {                                   
                                    router.push(`/settings/roles/update/${value.role}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button
                                onClick={()=>{
                                    //delete here
                                    showConfirmDialog(()=>{
                                         showProgress({ animated: true });;
                                        dResult.mutate(value.role);
                                    })
                                }}
                                 className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
    </FormContainer>
    )
}
export default function Index() {

    return (
     
        <CollectRequiredDataWrapper useHooks={useRolesRequiredData}>
            {(props) => <Roles {...props} />}
        </CollectRequiredDataWrapper>
    );
}
Index.getLayout = getLayout;


export function useRolesRequiredData(){
    // const config = useAppConfig();
    const roles = useRolesList();
    return {data:{...roles},isLoading:roles.isLoading}
}

export type RolesProps = ReturnType<typeof useRolesRequiredData>["data"]

export function usePermissionsList(){
    const [permissions, setPermissions] = useStore((s) => s.permissions);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getPolicies.useQuery(undefined,
        {
            onSuccess(data) {
                setPermissions({ permissions: data ?? null});
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setPermissions({ permissions: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])
  
  
    return {permissions,result,refetch, isLoading:result.isLoading}
}

export function useRolesList(){
    const [roles, setRoles] = useStore((s) => s.roles);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getRoles.useQuery(undefined,
        {
            onSuccess(data) {
                console.log(data)
                setRoles({ roles: data ?? []});
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setRoles({ roles: rResult.data ?? [] })
        }
        return rResult;
    }, [result.refetch])
  
  
    return {roles,result,refetch, isLoading:result.isLoading}
}

export function useRole(roleName:string){
    const [role, setRole] = useStore((s) => s.editingRole);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getRole.useQuery(roleName,
        {
            onSuccess(data) {
                setRole({ editingRole: data ?? null});
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setRole({ editingRole: rResult.data ?? null })
        }
        return rResult;
    }, [result.refetch])
  
  
    return {role,result,refetch, isLoading:result.isLoading}
}

export function useUserPermissions(){
    const [userPermissions, setUserPermissions] = useStore((s) => s.userPermissions);

    const trpcTenant = useTrpcTenant();
    const result = trpcTenant.authorization.getUserPermissions.useQuery(undefined,
        {
            onSuccess(data) {
                setUserPermissions({ userPermissions: data ?? []});
            },
        }
    );
    const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
        const rResult = await result.refetch(opts);
        if (rResult.isSuccess) {
            setUserPermissions({ userPermissions: rResult.data ?? [] })
        }
        return rResult;
    }, [result.refetch])
  
  
    return {userPermissions,result,refetch, isLoading:result.isLoading}
}
