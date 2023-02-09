import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { createUnitInputSchema, updateUnitInputSchema } from "@/core/unit/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm, ZodFormFieldOptions } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Unit } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { FC, ReactNode, useEffect, useMemo } from "react";
import { z, ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useUnits } from "@/lib/hooks/useUnits";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useUnitSearch } from "@/lib/hooks/useUnitSearch";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";

function useUnitFormOptions(opts?:Unit & {unit?:Unit}){
    const {unit,operator}=opts??{};   
    return useMemo(():ZodFormFieldOptions=>({
        tenantId:{
            hidden:true
        },
        id:{
            hidden:true
        },
        name:{
            label:"Unit name",
            ordering:1
        },
        shortName:{
            label:"Short name",
            ordering:2,
        },
        baseUnitId:{
            label:"Base unit",
            ordering:3,
            combobox:{
                elevation:48,
                value:unit,
                valuePath:"id",
                useGetDataHook:useUnitSearch
            }
        },
        operator:{
            label:"Operator",
            ordering:4,
            registerOptions:{
                value: operator
            },
            options:[{
                label:"Multiply",
                value:"x"
            },
            {
                label:"Division",
                value:"/"
            }
        ]
        },
        operatorValue:{
            label:"Operator value",
            ordering:5,
        },
    }),[opts]);
}
export function UnitIndex({units,refetch}:UnitIndexProps) {
    const [showModal, hide, data] = useModal();
   
    
   const trpcWithHost = useTrpcTenant();
   const {showProgress,callbacks} = useProgressFeedback()

   const result1 = trpcWithHost.product.unit.create.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });
   const result2 = trpcWithHost.product.unit.update.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });
   

    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        
                        showModal({
                            content:(props) => {                       
                       return <UnitForm 
                       {...props} 
                       mutateAsync={(data)=>{
                        showProgress({animated:true});
                        return result1.mutateAsync(data);
                      }}
                       schema={createUnitInputSchema}                        
                        title={
                        "Create Unit"
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
            rowsData={units ?? []}
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
                        Header: "Unit name",
                        accessor: "name"
                    },
                    {
                        Header: "Short name",
                        accessor: "shortName"
                    },
                    {
                        Header: "Base unit",
                        accessor: "unit.name",                       
                    },
                    {
                        Header: "Operator",
                        accessor: "operator"
                    },
                    {
                        Header: "Operator value",
                        accessor: "operatorValue"
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
                                   return <UnitForm 
                                   {...props} 
                                   mutateAsync={(data)=>{
                                    showProgress({animated:true});
                                    return result2.mutateAsync(data);
                                  }}
                                   schema={updateUnitInputSchema} 
                                  
                                   defaultValues={row.original}
                                   title="Update Unit"/>
                                   
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

function useRequiredUnitData(){
    const data = useUnits();
    return { data, isLoading: data.result.isLoading }
}

type UnitIndexProps = ReturnType<typeof useRequiredUnitData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useRequiredUnitData}>
            {(props) =>
                <UnitIndex {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}
Index.getLayout = getLayout;

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
    mutateAsync:(data:any)=>Promise<unknown>
}

const UnitForm:FC<ZodFormSchema<Unit>> =({ show, hide,mutateAsync, ModalContainer, ModalContent, ModalAction, schema,title, defaultValues })=>{
    const {tenant} = useTenant();
    const options = useUnitFormOptions(defaultValues as any)
    const [config, form] = useZodForm(schema,options,{defaultValues:{tenantId:tenant?.tenantId,...defaultValues}});
     useEffect(()=>{
        if(defaultValues) {
        form.reset(defaultValues)
        }
     },[defaultValues])
    
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