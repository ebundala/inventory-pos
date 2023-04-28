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
import { Customer } from "@prisma/client";
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

function UsersIndex({
  members,
  refetch,
}: UsersIndexProps) {
  const [showModal, hide, data] = useModal();
  const options = useMemo(
    () => ({
      tenantId: {
        hidden: true,
      },
      userId: {
        hidden: true,
      },
      email: {
        label:"Email",
        ordering:1,
      },
      message: {
        label: "Message",
        textArea:true,
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
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row, value }: { row: any; value: number }) => {
                  return (
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={(e) => {
                          console.log(row);
                          
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
    const {tenant, result: { isLoading, isSuccess },
    refetch,} = useTenant();
  

  return { data: { refetch, members:tenant?.members?? [] }, isLoading };
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

const InviteForm: FC<ZodFormSchema<Customer>> = ({
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
  const [config, form] = useZodForm(schema, fieldOptions, {
    defaultValues: { tenantId: tenant?.tenantId, ...defaultValues },
  });

  return (
    <ModalContainer>
      <ModalContent>
        <form
          onSubmit={form.handleSubmit(
            async (data) => {
              await mutateAsync(data as any);
            },
            (e) => {
              console.error(e);
            }
          )}
        >
          <div className="flex w-full text-center font-semibold">
            <h2>{title}</h2>
          </div>
          <div className="grid grid-flow-row grid-cols-1 gap-3">
            {config.map((i) => {
              return <FormInputField key={i.name} {...i} />;
            })}
          </div>
          <ModalAction>
            <button
              onClick={(e) => hide()}
              className="btn btn-outline btn-error btn-xs"
            >
              cancel
            </button>
            <button type="submit" className="btn btn-primary btn-xs">
              Invite
            </button>
          </ModalAction>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};
