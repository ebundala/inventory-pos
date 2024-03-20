import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { getLayout } from "@/layouts/getLayout";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import {
  Controller,
  FieldArrayPath,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";

import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { tRoleWithPermisionSchema } from "@/core/authorization/index.zod";
import { RolesProps } from ".";
import { useMemo } from "react";
import { PermissionInput, TRoleWithPermision } from "@/core/authorization";
import { useCreateRoleRequiredData } from "../../../../../lib/hooks/useCreateRoleRequiredData";

export function CreateRole({ permissions }: CreateRoleProps) {
  const options = {
    oldRoleName:{
      label:"Old role name",
      hidden:true,
    },
    role: {
      label: "Role name",
      "permissions.0.resource": {
        hidden: true
      },
      "permissions.0.action": {
        hidden: true
      }
    }
  };

  const [config, form] = useZodForm(tRoleWithPermisionSchema, options);

  const [regularConfig, fieldArrayConfig] =
    useSplitFormConfigToFieldArray(config);
  const fname = useFieldArrayName(fieldArrayConfig);

  const permissionForm = useFieldArray<
    FieldValues,
    FieldArrayPath<FieldValues>,
    "key"
  >({ control: form.control, name: fname });

  const trpcWithHost = useTrpcTenant();
  const { showProgress, callbacks } = useProgressFeedback("/settings/roles");

  const result = trpcWithHost.authorization.createRole.useMutation(callbacks);

  const permissionsList = useMemo(() => {
    const permissionMap = permissions.reduce((p, c, arr) => {
      const value: PermissionInput[] = p.get(c.resource) ?? [];
      value.push(c);
      return p.set(c.resource, value);
    }, new Map<string, PermissionInput[]>())
    return [...permissionMap];
  }, [permissions])
  const indexComulative = useMemo(() => {
    const permsLength = permissionsList.map((p) => p[1].filter(({ action }) => action !== "no-action").length);
    const cumulativeSum = ((sum: number) => (value: number) => sum += value)(0);
    return permsLength.map(cumulativeSum)
  }, [permissionsList]);

  return (
    <FormContainer title={<h2>Create Role</h2>}>
      <form
        
      >
        <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 gap-3">
          {regularConfig.map((i) => {
            return <FormInputField key={i.name} {...i} />;
          })}
        </div>
        <div className="text text-2xl font-bold mt-3">Permissions</div>
        <div className="w-full mt-3 grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-4">
          {permissionsList.map(([resource, actionList], index) => {
            const startIndex = index === 0 ? 0 : indexComulative[index - 1]
            
            return (<div className="h-60 shadow-md bottom border rounded-md bordner-gray-200 p-2 flex flex-col" key={resource}>
              <div className="text text-xl text-left font-semibold">{index + 1} {resource}</div>
              <div className="flex-1 flex-col">
                {actionList
                  .filter(({ action }) => action !== "no-action")
                  .map(({ action }, i) => <div key={`permissions.${startIndex + i}.action.${action}`}
                    className="flex flex-row w-full items-center p-1">
                    <Controller
                      control={form.control}
                      defaultValue={"no-action"}
                      name={`permissions.${startIndex + i}.action`}
                      render={({ field: { onBlur, onChange }, fieldState }) => {
                        return <input onChange={(e) => {
                          // console.log(e.target.checked);
                          if (e.target.checked) {
                            onChange({ target: { value: action } })
                          } else {
                            onChange({ target: { value: "no-action" } })

                          }
                        }}
                          type="checkbox" className="checkbox checkbox-primary checkbox-md mr-3" />
                      }}
                    />
                    <Controller
                      control={form.control}
                      name={`permissions.${startIndex + i}.resource`}
                      defaultValue={resource}
                      render={({ field, fieldState }) => {
                        return <input {...field} type="hidden" />
                      }}
                    />
                    <div className="text text-md font-medium">{action}</div>
                  </div>)}
              </div>
            </div>)
          })}
        </div>


        <div className="flex flex-row py-3 justify-start">
          <button type="submit" className=" btn btn-primary rounded-md  "
          onClick={form.handleSubmit(
            async (v) => {
              const data: TRoleWithPermision = v as unknown as TRoleWithPermision
              //submit here
              showProgress({ animated: true });
              const permissions = data.permissions.filter((p) => p.action!== "no-action")
              const dataFiltered = {...data,permissions};
              await result.mutateAsync(dataFiltered as any);
  
              
            },
            (e) => {
              console.error(e);
            }
          )}>
            Submit
          </button>
        </div>
      </form>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useCreateRoleRequiredData}>
      {(props) => <CreateRole {...props} />}
    </CollectRequiredDataWrapper>
  );
}
Index.getLayout = getLayout;

export type CreateRoleProps = ReturnType<typeof useCreateRoleRequiredData>['data']