import { FormInputField } from "@/components/FormInputField";
import { createCategoryInputSchema, updateCategoryInputSchema } from "@/core/category/index.zod";
import { getLayout } from "@/layouts/getLayout"
import { useModal } from "@/lib/hooks/useModel";
import { useTenant } from "@/lib/hooks/useTenant";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { ModalData } from "@/types/ModalData";
import { ModalSectionProps } from "@/types/ModalSectionProps";
import { Category } from "@prisma/client";
import { FC, ReactNode, useMemo } from "react";
import { ZodFirstPartySchemaTypes } from "zod";
import { CustomTable } from "@/components/table";
import { useCategories } from "@/lib/hooks/useCategories";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";

export function CategoryIndex({categories,refetch}:CategoryIndexProps) {
    const [showModal, hide, data] = useModal();
    
    
   const trpcWithHost = useTrpcTenant();
   const {showProgress,callbacks} = useProgressFeedback()

   const result1 = trpcWithHost.product.category.create.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });

   const result2 = trpcWithHost.product.category.update.useMutation({
    onSuccess:(data,variable,ctx)=>{
        callbacks.onSuccess(data);
        hide();
        refetch()
    },
    onError:(error)=>{
        callbacks.onError(error);
    }
   });

    return  <FormContainer title={<h2>All Category</h2>}>
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        
                        showModal({
                            content:(props) => {                       
                       return <CategoryForm 
                       {...props} 
                       mutateAsync={(data)=>{
                        showProgress({animated:true});
                        return result1.mutateAsync(data);
                      }}
                       schema={createCategoryInputSchema}                        
                       title={
                        "Create category"
                       }/>
                            }
                          
                        })
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={categories ?? []}
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
                        Header: "Category name",
                        accessor: "name"
                    },
                    {
                        Header: "Code",
                        accessor: "code"
                    },
                    
                    {
                        Header: "Actions",
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <div className="flex flex-row gap-2">
                                <button onClick={(e)=>{
                                   // console.log(row);
                                    showModal({
                                        content:(props) => {                       
                                   return <CategoryForm 
                                   {...props} 
                                   mutateAsync={(data)=>{
                                      showProgress({animated:true});
                                      return result2.mutateAsync(data);
                                    }}
                                   schema={updateCategoryInputSchema}                                    
                                   defaultValues={row.original}
                                   title="Update category"/>
                                   
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

}

function useRequiredCategoryData(){
    const data = useCategories();
    return { data, isLoading: data.result.isLoading }
}

type CategoryIndexProps = ReturnType<typeof useRequiredCategoryData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useRequiredCategoryData}>
            {(props) =>
                <CategoryIndex {...props} />
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

const CategoryForm:FC<ZodFormSchema<Category>> =({ show, hide, mutateAsync, ModalContainer, ModalContent, ModalAction, schema,title, defaultValues})=>{
    const {tenant} = useTenant();
    const options = useMemo(()=>({
        tenantId:{
            hidden:true
        },
        id:{
            hidden:true
        },
        name:{
            label:"Category name",
            ordering:1
        },
        description:{
            label:"code",
            ordering:2,
        },
        
       
    }),[]);
    const [config, form] = useZodForm(schema,options,{defaultValues:{tenantId:tenant?.tenantId,...defaultValues}});

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