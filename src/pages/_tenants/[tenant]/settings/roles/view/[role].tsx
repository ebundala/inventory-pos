
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout";
import { CollectHooksReturnType, CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { numberFormat } from "@/lib/util";
import { RoleInput } from "@/core/authorization";
import { useRole } from "@/lib/hooks/useRole";
import { useRoleRequiredData } from "@/lib/hooks/useRoleRequiredData";

export function ViewRole({
  role,
  permissions,
  isLoading,
  refetch,
}: UpdateRoleProps) {
  
const fmt = new Intl.DateTimeFormat();
  if ((!role || !role?.role) && !isLoading)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid role</span>
      </div>
    );

  return (
    <FormContainer title={<h2>Role # {role?.role}</h2>}>
      <div className="flex flex-col pt-4 items-start justify-start">
       {/* Todo show permissions here */}
       <h3 className="text font-semibold text-xl py-4">Permissions</h3>
       {permissions.filter((v)=>v.action!="no-action").map((v)=><div key={`${v.resource}${v.action}`}
       className="text text-md text-right py-1"
      >{`${v.action} ${v.resource}`}</div>)}
      </div>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useRoleRequiredData}>
      {(props) => {
        return <ViewRole {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

type UpdateRoleProps = ReturnType<
  typeof useRoleRequiredData
>["data"];

