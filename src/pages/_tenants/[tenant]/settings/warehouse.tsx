import { FormInputField } from "@/components/FormInputField";
import { createWarehouseInputSchema, updateWarehouseInputSchema } from "@/core/warehouse/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Warehouse } from "@prisma/client";
import { FC, ReactNode, useMemo } from "react";
import { ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useWarehouses } from "@/lib/hooks/useWarehouses";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { pageOptions } from "@/lib/config/pageOptions";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";

export function WarehouseIndex({ warehouses, refetch }: WarehouseIndexProps) {

    const [showModal, hide, data] = useModal();
    const options = useMemo(() => ({
        tenantId: {
            hidden: true
        },
        id: {
            hidden: true
        },
        name: {
            label: "Warehouse name",
            ordering: 1
        },
        email: {
            label: "email",
            ordering: 2
        },
        mobile: {
            label: "Phone",
            ordering: 3
        },
        country: {
            label: "Country",
            ordering: 4
        },
        city: {
            label: "city",
            ordering: 5
        },
        zip: {
            label: "Zip code",
            ordering: 5
        }
    }), []);

    const trpcWithHost = useTrpcTenant();
    const { showProgress, callbacks } = useProgressFeedback()

    const result1 = trpcWithHost.setting.warehouse.create.useMutation({
        onSuccess: (data, variable, ctx) => {
            callbacks.onSuccess(data);
            hide();
            refetch()
        },
        onError: (error) => {
            callbacks.onError(error);
        }
    });
    const result2 = trpcWithHost.setting.warehouse.update.useMutation({
        onSuccess: (data, variable, ctx) => {
            callbacks.onSuccess(data);
            hide();
            refetch()
        },
        onError: (error) => {
            callbacks.onError(error);
        }
    });

    const dResult = trpcWithHost.setting.warehouse.delete.useMutation(callbacks);
    const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })


    return <FormContainer title={<h2>All Warehouses</h2>}> <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {

                        showModal({
                            content: (props) => {
                                return <WarehouseForm
                                    {...props}
                                    mutateAsync={(data) => {
                                        showProgress({ animated: true });
                                        return result1.mutateAsync(data);
                                    }}
                                    schema={createWarehouseInputSchema}
                                    fieldOptions={options} title={
                                        "Create Warehouse"
                                    } />
                            }

                        })
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={warehouses ?? []}
            collumsData={() => {

                return [
                    {
                        Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        ,
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        }
                    },
                    {
                        Header: "Warehouse name",
                        accessor: "name"
                    },
                    {
                        Header: "Email",
                        accessor: "email"
                    },
                    {
                        Header: "Phone",
                        accessor: "mobile"
                    },
                    {
                        Header: "Country",
                        accessor: "country"
                    },
                    {
                        Header: "Zip code",
                        accessor: "zip"
                    },
                    {
                        Header: "Actions",
                        accessor: "id",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: number }) => {
                            return <div className="flex flex-row gap-2">
                                <button onClick={(e) => {
                                    console.log(row);
                                    showModal({
                                        content: (props) => {
                                            return <WarehouseForm
                                                {...props}
                                                mutateAsync={(data) => {
                                                    showProgress({ animated: true });
                                                    return result2.mutateAsync(data);
                                                }}
                                                schema={updateWarehouseInputSchema}
                                                fieldOptions={options}
                                                defaultValues={row.original}
                                                title="Update warehouse" />

                                        }
                                    })
                                }} className="btn btn-info btn-sm rounded-md btn-outline">Edit</button>
                                <button
                                    onClick={
                                        () => {
                                            showConfirmDialog(() => {
                                                showProgress();
                                                dResult.mutate(value)

                                            })
                                        }
                                    }
                                    className="btn btn-warning btn-sm rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
    </FormContainer>

}


export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useWarehouseRequiredData}>
            {(props) => <WarehouseIndex {...props} />}
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout

type ZodFormSchema<R, T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes> = {
    show: (data: ModalData) => void;
    hide: () => void;
    ModalContainer: FC<ModalSectionProps>;
    ModalContent: FC<ModalSectionProps>;
    ModalAction: FC<ModalSectionProps>;
    title?: ReactNode,
    schema: T
    defaultValues?: Partial<R>
    fieldOptions?: Parameters<typeof useZodForm>[1]
    mutateAsync: (data: any) => Promise<unknown>
}

const WarehouseForm: FC<ZodFormSchema<Warehouse>> = ({ show, hide, mutateAsync, ModalContainer, ModalContent, ModalAction, schema, title, defaultValues, fieldOptions }) => {
    const { tenant } = useTenant();
    const [config, form] = useZodForm(schema, fieldOptions, { defaultValues: { tenantId: tenant?.tenantId, ...defaultValues } });

    return (
        <ModalContainer>
            <ModalContent>
                <form onSubmit={form.handleSubmit(async (data) => {
                    await mutateAsync(data as any);
                }, (e) => {
                    console.error(e)
                })}>
                    <div className="flex w-full text-center font-semibold"><h2>{title}</h2></div>
                    <div className="grid grid-flow-row grid-cols-1  sm:grid-cols-2 gap-3">
                        {config.map((i) => {
                            return (<FormInputField key={i.name} {...i} />);
                        })}
                    </div>
                    <ModalAction >
                        <button onClick={(e) => hide()} className="btn btn-outline btn-error btn-xs">
                            cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-xs">
                            save
                        </button>
                    </ModalAction>
                </form>
            </ModalContent>


        </ModalContainer>

    )
}

function useWarehouseRequiredData() {

    const { warehouses, result: { isLoading, isSuccess }, refetch } = useWarehouses();

    return { isLoading, data: { warehouses, refetch } };

}

type WarehouseIndexProps = ReturnType<typeof useWarehouseRequiredData>['data']
