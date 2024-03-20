import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import {
  createCustomerInputSchema,
  updateCustomerInputSchema,
} from "@/core/customer/index.zod";
import { getLayout } from "@/layouts/getLayout";
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Customer, User } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { FC, ReactNode, useMemo } from "react";
import { z, ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { pageOptions } from "@/lib/config/pageOptions";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { inviteMemberInputSchema } from "@/core/tenant/index.zod";
import Image from "next/image";
import { getImageUrls } from "@/core/util/getImageUrls";
import { useRolesList } from "@/lib/hooks/useRolesList";
import { Controller, useFieldArray } from "react-hook-form";
import { useGetZodFormFields } from "@/lib/hooks/useGetZodFormFields";

const rolesSchema = z.object({
  userId: z.string(),
  roles: z.array(z.string())
});

function UsersIndex({
  members,
  refetch,
}: UsersIndexProps) {
  const [showModal, hide, data] = useModal();
  const options = useMemo(
    () => ({

      userId: {
        hidden: true,
      },
      email: {
        label: "Email",
        ordering: 1,
      },
      message: {
        label: "Message",
        textArea: true,
        ordering: 10,
      },

    }),
    []
  );

  const trpcWithHost = useTrpcTenant();
  const { showProgress, callbacks } = useProgressFeedback();

  const result = trpcWithHost.tenant.inviteMember.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      hide();
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
  const result1 = trpcWithHost.authorization.assignRoles.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      hide();
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
  const showConfirmDialog = useConfirmDialog({ message: "You are about to remove this user from your business this action is irrivesible?" })


  return (
    <FormContainer title={<h2>All Users</h2>}>
      <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
          <button
            className="btn btn-success btn-sm btn-outline"
            onClick={(e) => {
              showModal({
                content: (props) => {
                  return (
                    <InviteForm
                      {...props}
                      mutateAsync={(data) => {
                        showProgress({ animated: true });
                        return result.mutateAsync(data);
                      }}
                      schema={inviteMemberInputSchema}
                      fieldOptions={options}
                      title={"Invite Member"}
                    />
                  );
                },
              });
            }}
          >
            Invite
          </button>
        </div>

        <CustomTable
          pageOptions={pageOptions}
          rowsData={members ?? []}
          collumsData={() => {
            return [
              {
                Header: () => (
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-xs "
                    />
                  </label>
                ),
                accessor: "tenantId",
                disableSortBy: true,
                Cell: ({ row, value }: { row: any; value: any }) => {
                  return (
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-xs "
                      />
                    </label>
                  );
                },
              },
              {
                Header: "Picture",
                accessor: "image",
                Cell: ({ row, value }: { row: any, value: string }) => {
                  return <Image className="rounded-full shadow-md border-2 border-gray-400" src={value} height={40} width={40} alt="product picture" />
                }
              },
              {
                Header: "Name",
                accessor: "name",
              },

              {
                Header: "Email",
                accessor: "email",
              },
              {
                Header: "Phone",
                accessor: "phone",
              },
              {
                Header: "Roles",
                accessor: "roles",
                Cell: ({ value }: { value: string[] }) => {
                  return (
                    <div className="flex flex-col ">
                      {value.map((v) => (<div key={v} className="text text-sm">{v}</div>))}
                    </div>)
                }
              },
              {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row, value }: { row: any; value: number }) => {
                  const user = row.original as User & { roles: string[] };

                  return (
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={(e) => {
                          showModal({
                            content: (props) => {
                              return (
                                <RolesForm
                                  {...props}
                                  mutateAsync={(data) => {
                                    showProgress({ animated: true });
                                    return result1.mutateAsync(data);
                                  }}
                                  schema={rolesSchema}
                                  defaultValues={{ roles: user?.roles ?? [], userId: user.id }}
                                  // fieldOptions={{}}
                                  title={`Roles for ${user?.name ?? ""}`}
                                />
                              );
                            },
                          });

                        }}
                        className="btn btn-info btn-sm rounded-md btn-outline"
                      >
                        Roles
                      </button>
                      <button
                        onClick={() => {
                          showConfirmDialog(() => {
                            //  showProgress({ animated: true });;
                            //  dResult.mutate(value);
                          })
                        }}
                        className="btn btn-warning btn-sm rounded-md btn-outline">
                        Remove
                      </button>
                    </div>
                  );
                },
              },
            ];
          }}
        />
      </div>
    </FormContainer>
  );
}

function useUsersRequiredData() {
  const { tenant, result: { isLoading, isSuccess },
    refetch, } = useTenant();


  return { data: { refetch, members: tenant?.members ?? [] }, isLoading };
}

type UsersIndexProps = ReturnType<typeof useUsersRequiredData>["data"];

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useUsersRequiredData}>
      {(props) => <UsersIndex {...props} />}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

type ZodFormSchema<
  R,
  T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes
> = {
  show: (data: ModalData) => void;
  hide: () => void;
  ModalContainer: FC<ModalSectionProps>;
  ModalContent: FC<ModalSectionProps>;
  ModalAction: FC<ModalSectionProps>;
  title?: ReactNode;
  schema: T;
  defaultValues?: Partial<R>;
  fieldOptions?: Parameters<typeof useZodForm>[1];
  mutateAsync: (data: any) => Promise<unknown>;
};

type InviteInput = z.infer<typeof inviteMemberInputSchema>;

const InviteForm: FC<ZodFormSchema<InviteInput, typeof inviteMemberInputSchema>> = ({
  show,
  hide,
  mutateAsync,
  ModalContainer,
  ModalContent,
  ModalAction,
  schema,
  title,
  defaultValues,
  fieldOptions,
}) => {
  const { tenant } = useTenant();
  const { roles, isLoading } = useRolesList();
  const [config, form] = useZodForm(schema, fieldOptions, {
    defaultValues: { ...defaultValues },
  });

  const arrForm = useFieldArray({ control: form.control, name: "roles" });

  if (isLoading) {
    return <Loader />
  }


  return (
    <ModalContainer>
      <ModalContent>
        <form

        >
          <div className="flex w-full text-center font-semibold">
            <h2 className="text text-lg font-semibold">{title}</h2>
          </div>
          <div className="grid grid-flow-row grid-cols-1 gap-3">
            {config.filter((v) => v.name !== "roles").map((i) => {
              return <FormInputField key={i.name} {...i} />;
            })}
          </div>


          <div className="flex flex-col mt-3">
            <h3 className="text text-sm font-semibold">User roles</h3>

            <div className="grid grid-flow-row grid-cols-1 gap-1">

              {(roles ?? []).map((v, i) => {
                return (<div key={v.role} className="flex flex-row justify-between">
                  <div className="text ">{v.role}</div>
                  <Controller
                    control={form.control}
                    defaultValue={"no-role"}
                    name={`roles.${i}`}
                    render={({ field: { onBlur, onChange, value }, fieldState }) => {
                      return <input onChange={(e) => {

                        if (e.target.checked) {

                          onChange({ target: { value: v.role } })
                        } else {
                          onChange({ target: { value: "no-role" } })

                        }
                      }}
                        checked={value === v.role}
                        type="checkbox" className="checkbox checkbox-primary checkbox-md mr-3" />
                    }}
                  />
                </div>)
              })}
            </div>

          </div>
          <ModalAction>
            <button
              onClick={(e) => hide()}
              className="btn btn-outline btn-error btn-xs"
            >
              cancel
            </button>
            <button type="submit"
              className="btn btn-primary btn-xs"
              onClick={form.handleSubmit(
                async (data) => {
                  const { email, message, roles } = data as InviteInput;
                  await mutateAsync({ email, message, roles: roles.filter((v) => v !== "no-role") });
                },
                (e) => {
                  console.error(e);
                }
              )}
            >
              Invite
            </button>
          </ModalAction>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};

type RolesInput = z.infer<typeof rolesSchema>;

const RolesForm: FC<ZodFormSchema<RolesInput,typeof rolesSchema>> = ({
  show,
  hide,
  mutateAsync,
  ModalContainer,
  ModalContent,
  ModalAction,
  schema,
  title,
  defaultValues,
  fieldOptions,
}) => {
  const { tenant } = useTenant();
  const { roles, isLoading } = useRolesList();
  const [config, form] = useZodForm(schema, fieldOptions,
    { defaultValues: { userId: defaultValues?.userId, roles: [] } }
  );
  const arrForm = useFieldArray({ control: form.control, name: "roles" });
  // const values: string[] = form.watch("roles",[]);
  const initialValuesSet = useMemo(() => {
    const { roles } = defaultValues!;

    const r = (roles ?? []).filter((v) => v).reduce((p, c) => {
      return p.add(c!);
    }, new Set<string>());
    return r;
  }, [defaultValues])



  if (isLoading) {
    return <Loader />
  }
  return (
    <ModalContainer>
      <ModalContent>
        <form

        >
          <div className="flex w-full text-center font-semibold">
            <h2 className="text font-bold mb-4">{title}</h2>
          </div>
          <div className="grid grid-flow-row grid-cols-1 gap-3">

            {(roles ?? []).map((v, i) => {
              return (<div key={v.role} className="flex flex-row justify-between">
                <div className="text text-xl font-semibold">{v.role}</div>
                <Controller
                  control={form.control}
                  defaultValue={initialValuesSet.has(v.role) ? v.role : "no-role"}
                  name={`roles.${i}`}
                  render={({ field: { onBlur, onChange, value }, fieldState }) => {
                    return <input onChange={(e) => {

                      if (e.target.checked) {

                        onChange({ target: { value: v.role } })
                      } else {
                        onChange({ target: { value: "no-role" } })

                      }
                    }}
                      checked={value === v.role}
                      type="checkbox" className="checkbox checkbox-primary checkbox-md mr-3" />
                  }}
                />
              </div>)
            })}
          </div>
          <ModalAction>
            <button
              onClick={(e) => hide()}
              className="btn btn-outline btn-error btn-xs"
            >
              Cancel
            </button>
            <button type="submit"
              className="btn btn-primary btn-xs"
              onClick={form.handleSubmit(
                async (data) => {
                  const { roles } = data as { roles: (string | undefined)[] }
                  const data2 = { ...data, roles: roles.filter((v) => v !== "no-role") }

                  await mutateAsync(data2);
                },
                (e) => {
                  console.error(e);
                }
              )}
            >
              Save
            </button>
          </ModalAction>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};
