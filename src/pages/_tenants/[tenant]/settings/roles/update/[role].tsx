/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { getLayout } from "@/layouts/getLayout";
import { FormFieldOption, useZodForm } from "@/lib/util/form-gen";
import { ParsedUrlQuery } from "querystring";
import { useAdjustmentFormFieldOptions } from "@/lib/hooks/useAdjustmentFormFieldOptions";
import { useEffect, useMemo } from "react";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { useFieldArray, FieldValues, FieldArrayPath, Controller } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import {
  AdjustmentDetail,
  Prisma,
  Product,
  ProductVariant,
  ProductWarehouse,
} from "@prisma/client";
import { CustomTable } from "@/components/table";
import { FormComboBox } from "@/components/combobox";
import { useProductSearch } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useAdjustmentRequiredData } from "@/lib/hooks/useAdjustmentRequiredData";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { calculateStock } from "@/lib/util/calculateStock";
import { TStockDataInput } from "@/types/TStockDataInput";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useAdjustmentStockConstraints } from "@/lib/hooks/useAdjustmentStockConstraints";
import { PermissionInput, TRoleWithPermision } from "@/core/authorization";
import { tRoleWithPermisionSchema } from "@/core/authorization/index.zod";
import { useRoleRequiredData } from "../../../../../../lib/hooks/useRoleRequiredData";



export function UpdateRole({
  role,
  permissions,
  isLoading,
  refetch,
}: UpdateRoleProps) {

  const options= {
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

  const result = trpcWithHost.authorization.updateRole.useMutation(callbacks);

  const permissionsList = useMemo(() => {
    const permissionMap = permissions.reduce((p, c, arr) => {
      const value: PermissionInput[] = p.get(c.resource) ?? [];
      value.push(c);
      return p.set(c.resource, value);
    }, new Map<string, PermissionInput[]>()) ?? new Map<string, PermissionInput[]>()
    return [...permissionMap];
  }, [permissions])

  const indexComulative = useMemo(() => {
    const permsLength = permissionsList.map((p) => p[1]/*.filter(({ action }) => action !== "no-action")*/.length);
    const cumulativeSum = ((sum: number) => (value: number) => sum += value)(0);
    return permsLength.map(cumulativeSum)
  }, [permissionsList]);

  const savedPermsMap = useMemo(() => {
    return (role?.permissions ?? []).reduce((p, c) => {
      return p.set(`${c.resource}-${c.action}`, c)
    }, new Map<string, PermissionInput>())
  }, [role])

  useEffect(() => {
    if (role) {
      const permissions = permissionsList.flatMap(([resource, actionList], index) => {
       // const startIndex = index === 0 ? 0 : indexComulative[index - 1]
        return actionList.map((p) => {
          const sv = savedPermsMap.get(`${resource}-${p.action}`)
          if (sv) {
            return sv;
          }
          return {...p,action:"no-action"} as PermissionInput;
        })
      })
      form.reset({ ...role, oldRoleName:role.role, permissions });
    }
  }, []);

  
  if (!role && !isLoading)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid role</span>
      </div>
    );
  return (
    <FormContainer title={<h2>Update Role</h2>}>
      <form
        onSubmit={form.handleSubmit(
          async (v) => {
            const data: TRoleWithPermision = v as unknown as TRoleWithPermision
            //submit here
            showProgress({ animated: true });
            const permissions = data.permissions.filter((p) => p.action !== "no-action")
            const dataFiltered = { ...data, permissions };
            console.log(dataFiltered);
            await result.mutateAsync(dataFiltered as any);
          },
          (e) => {
            console.error(e);
          }
        )}
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
                    className={`flex flex-row w-full items-center p-1 ${action === "no-action"?"hidden":""}`}>
                    <Controller
                      control={form.control}
                      defaultValue={"no-action"}
                      name={`permissions.${startIndex + i}.action`}
                      render={({ field: { onBlur, onChange, value }, fieldState }) => {
                        return <input onChange={(e) => {
                          // console.log(e.target.checked);
                          if (e.target.checked) {
                            onChange({ target: { value: action } })
                          } else {
                            onChange({ target: { value: "no-action" } })

                          }
                        }}
                          checked={value !== "no-action"}
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
          
          >
            Submit
          </button>
        </div>
      </form>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useRoleRequiredData}>
      {(props) => {
        return <UpdateRole {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

type UpdateRoleProps = ReturnType<
  typeof useRoleRequiredData
>["data"];

