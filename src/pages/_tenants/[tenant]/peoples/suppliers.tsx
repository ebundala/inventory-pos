import { FormInputField } from "@/components/FormInputField";
import Loader from "@/components/sites/Loader";
import { createSupplierInputSchema, updateSupplierInputSchema } from "@/core/supplier/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Supplier } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import { FC, ReactNode, useMemo } from "react";
import { z, ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useSuppliers } from "@/lib/hooks/useSuppliers";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { pageOptions } from "@/lib/config/pageOptions";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";


function SupplierIndex({suppliers,refetch}:SupplierIndexProps) {
    const [showModal, hide, data] = useModal();
    const options = useMemo(()=>({
        tenantId:{
            hidden:true
        },
        id:{
            hidden:true
        },
        name:{
            label:"Supplier name",
            ordering:1
        },
        code:{
            label:"Code",
            ordering:2
        },
        email:{
            label:"email",
            ordering:2
        },
        phone:{
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
        address:{
            label:"Address",
            ordering:5
        }
    }),[]);
    
   const trpcWithHost = useTrpcTenant();
   const {showProgress,callbacks} = useProgressFeedback()

   const result1 = trpcWithHost.people.supplier.create.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });
   const result2 = trpcWithHost.people.supplier.update.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });

    return (
        <FormContainer title={<h2>All Suppliers</h2>}>
    
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {                        
                        showModal({
                            content:(props) => {                       
                       return <SupplierForm 
                       {...props} 
                       mutateAsync={(data)=>{
                        showProgress({animated:true});
                        return result1.mutateAsync(data);
                      }}
                       schema={createSupplierInputSchema} 
                       fieldOptions={options} title={
                        "Create Supplier"
                       }/>
                            }
                          
                        })
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={suppliers ?? []}
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
                        Header: "Supplier name",
                        accessor: "name"
                    },
                    {
                        Header: "Code",
                        accessor: "code"
                    },
                    {
                        Header: "Email",
                        accessor: "email"
                    },
                    {
                        Header: "Phone",
                        accessor: "phone"
                    },
                    {
                        Header: "Country",
                        accessor: "country"
                    },
                    {
                        Header: "Address",
                        accessor: "address"
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
                                   return <SupplierForm 
                                   {...props} 
                                   mutateAsync={(data)=>{
                                    showProgress({animated:true});
                                    return result2.mutateAsync(data);
                                  }}
                                   schema={updateSupplierInputSchema} 
                                   fieldOptions={options} 
                                   defaultValues={row.original}
                                   title="Update Supplier"/>
                                   
                                }})
                            }} className="btn btn-info btn-sm rounded-md btn-outline">Edit</button>
                                <button className="btn btn-warning btn-sm rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
    </FormContainer>
    )

}

function useSupplierRequiredData() {
    const {
     suppliers,
      result: { isLoading, isSuccess },
      refetch,
    } = useSuppliers();
  
    return { data: { refetch,suppliers }, isLoading };
  }
  
  type SupplierIndexProps = ReturnType<typeof useSupplierRequiredData>["data"];
  
  export default function Index() {
    return (
      <CollectRequiredDataWrapper useHooks={useSupplierRequiredData}>
        {(props) => <SupplierIndex {...props} />}
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

const SupplierForm:FC<ZodFormSchema<Supplier>> =({ show, hide,mutateAsync, ModalContainer, ModalContent, ModalAction, schema,title, defaultValues,fieldOptions })=>{
    const {tenant} = useTenant();
    const [config, form] = useZodForm(schema,fieldOptions,{defaultValues:{tenantId:tenant?.tenantId,...defaultValues}});

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