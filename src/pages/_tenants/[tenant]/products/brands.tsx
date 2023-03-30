import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import {
  createBrandInputSchema,
  updateBrandInputSchema,
} from "@/core/brand/index.zod";
import { getLayout } from "@/layouts/getLayout";
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Brand } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { FC, ReactNode, useMemo } from "react";
import { z, ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useBrands } from "@/lib/hooks/useBrands";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { pageOptions } from "@/lib/config/pageOptions";
import Image from "next/image";
import { getImageUrls } from "@/core/util/getImageUrls";
import { FormContainer } from "@/components/FormContainer";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";

export function BrandIndex({ brands, refetch }: BrandsIndexProps) {
  const [showModal, hide, data] = useModal();
  const options = useMemo(
    () => ({
      tenantId: {
        hidden: true,
      },
      id: {
        hidden: true,
      },
      name: {
        label: "Brand name",
        ordering: 1,
      },
      description: {
        label: "Description",
        ordering: 2,
        textArea: true,
      },
      image: {
        label: "Logo",
        ordering: 3,
        upload: true,
      },
    }),
    []
  );

  const trpcWithHost = useTrpcTenant();
  const { showProgress, callbacks } = useProgressFeedback();

  const result1 = trpcWithHost.product.brand.create.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      hide();
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
  const result2 = trpcWithHost.product.brand.update.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      hide();
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
  const dResult = trpcWithHost.product.brand.delete.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
  const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })

  return (
    <FormContainer title={<h2>All Brands</h2>}>
      <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
          <button
            className="btn btn-success btn-sm btn-outline"
            onClick={(e) => {
              showModal({
                content: (props) => {
                  return (
                    <BrandForm
                      {...props}
                      mutateAsync={(data) => {
                        showProgress({ animated: true });
                        return result1.mutateAsync(data);
                      }}
                      schema={createBrandInputSchema}
                      fieldOptions={options}
                      title={"Create Brand"}
                    />
                  );
                },
              });
            }}
          >
            create
          </button>
        </div>

        <CustomTable
          pageOptions={pageOptions}
          rowsData={brands ?? []}
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
                Header: "Logo",
                accessor: "image",
                Cell: ({ row, value }: { row: any, value: string }) => {
                  const urls = getImageUrls(value)
                  return <Image src={urls[0]} height={40} width={40} alt="product picture" />
                }
              },
              {
                Header: "Brand name",
                accessor: "name",
              },
              {
                Header: "Description",
                accessor: "description",
              },


              {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row, value }: { row: any; value: any }) => {
                  return (
                    <div className="flex flex-row gap-2">
                      <button
                        onClick={(e) => {

                          showModal({
                            content: (props) => {
                              return (
                                <BrandForm
                                  {...props}
                                  mutateAsync={(data) => {
                                    showProgress({ animated: true });
                                    return result2.mutateAsync(data);
                                  }}
                                  schema={updateBrandInputSchema}
                                  fieldOptions={options}
                                  defaultValues={row.original}
                                  title="Update brand"
                                />
                              );
                            },
                          });
                        }}
                        className="btn btn-info btn-sm rounded-md btn-outline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          showConfirmDialog(() => {
                            showProgress();
                            dResult.mutate(value);
                            
                          });
                        }}
                        className="btn btn-warning btn-sm rounded-md btn-outline">
                        Delete
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
function useRequiredBrandsData() {
  const data = useBrands();
  return { data, isLoading: data.result.isLoading };
}
type BrandsIndexProps = ReturnType<typeof useRequiredBrandsData>["data"];

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useRequiredBrandsData}>
      {(props) => <BrandIndex {...props} />}
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

const BrandForm: FC<ZodFormSchema<Brand>> = ({
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
          <div className="grid grid-flow-row grid-cols-1 ">
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
              save
            </button>
          </ModalAction>
        </form>
      </ModalContent>
    </ModalContainer>
  );
};
