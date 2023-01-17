import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { createWarehouseInputSchema, updateWarehouseInputSchema } from "@/core/warehouse/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Warehouse } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { FC, ReactNode, useMemo } from "react";
import { z, ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useWarehouses } from "@/lib/hooks/useWarehouses";

export default function CurrencyIndex() {
    const {warehouses, result:{isLoading:loading, isSuccess:success},refetch} = useWarehouses();
    const [showModal, hide, data] = useModal();
    const options = useMemo(()=>({
        tenantId:{
            hidden:true
        },
        id:{
            hidden:true
        },
        name:{
            label:"Warehouse name",
            ordering:1
        },
        email:{
            label:"email",
            ordering:2
        },
        mobile:{
            label:"Phone",
            ordering:3
        },
        country:{
            label:"Country",
            ordering:4
        },
        city:{
            label:"city",
            ordering:5
        },
        zip:{
            label:"Zip code",
            ordering:5
        }
    }),[]);
    
   const trpcWithHost = useTrpcTenant();
   const result1 = trpcWithHost.setting.warehouse.create.useMutation({
    onSuccess:(data,variable,ctx)=>{
        hide();
        refetch();
    }
   });
   const result2 = trpcWithHost.setting.warehouse.update.useMutation({
    onSuccess:(data,variable,ctx)=>{
        hide();
        refetch()
    }
   });
    if (loading) return <Loader />

    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        
                        showModal({
                            content:(props) => {                       
                       return <WarehouseForm 
                       {...props} 
                       useMutationResult={result1}
                       schema={createWarehouseInputSchema} 
                       fieldOptions={options} title={
                        "Create Warehouse"
                       }/>
                            }
                          
                        })
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={[
                {
                    label: "1 item per page",
                    value: 1
                },
                {
                    label: "2 item per page",
                    value: 2
                },
                {
                    label: "All items",
                    value: 10000
                }
            ]}
            rowsData={warehouses ?? []}
            collumsData={() => {

                return [
                    {
                        Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        ,
                        accessor: "id",
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
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <div className="flex flex-row gap-2">
                                <button onClick={(e)=>{
                                    console.log(row);
                                    showModal({
                                        content:(props) => {                       
                                   return <WarehouseForm 
                                   {...props} 
                                   useMutationResult={result2}
                                   schema={updateWarehouseInputSchema} 
                                   fieldOptions={options} 
                                   defaultValues={row.original}
                                   title="Update warehouse"/>
                                   
                                }})
                            }} className="btn btn-info btn-sm rounded-md btn-outline">Edit</button>
                                <button className="btn btn-warning btn-sm rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>

}

CurrencyIndex.getLayout = getLayout

type ZodFormSchema<R,T extends ZodFirstPartySchemaTypes = ZodFirstPartySchemaTypes>={
    show: (data: ModalData) => void;
    hide: () => void;
    ModalContainer: FC<ModalSectionProps>;
    ModalContent: FC<ModalSectionProps>;
    ModalAction: FC<ModalSectionProps>;
    title?:ReactNode,
    schema:T
    defaultValues?: Partial<R>
    fieldOptions?: Parameters<typeof useZodForm>[1]
    useMutationResult:UseMutationResult<R,unknown,z.infer<T>,unknown>
}

const WarehouseForm:FC<ZodFormSchema<Warehouse>> =({ show, hide,useMutationResult, ModalContainer, ModalContent, ModalAction, schema,title, defaultValues,fieldOptions })=>{
    const {tenant} = useTenant();
    const [config, form] = useZodForm(schema,fieldOptions,{defaultValues:{tenantId:tenant?.tenantId,...defaultValues}});

    return (
        <ModalContainer>
            <ModalContent>
                <form onSubmit={form.handleSubmit(async (data) => {
                  await useMutationResult.mutateAsync(data as any);
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