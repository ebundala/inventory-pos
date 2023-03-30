import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useTransfers } from "@/lib/hooks/useTransfers";
//import { useTransfers } from "@/lib/hooks/useTransfers";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function Transfers({ transfers,defaultCurrency, refetch }: TransferListProps) {
    const router = useRouter();
    const trpcTenant = useTrpcTenant();
    const { showProgress, callbacks } = useProgressFeedback()
    const dResult = trpcTenant.transfer.delete.useMutation({
        onSuccess: (data, variable, ctx) => {
          callbacks.onSuccess(data);
          refetch();
        },
        onError: (error) => {
          callbacks.onError(error);
        },
      });
    const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })


    return  <FormContainer title={<h2>All Transfers</h2>}><div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        router.push("/transfers/create")

                    }
                }
            >create</button>
        </div>
        <div className="w-full ">
            <CustomTable
                pageOptions={pageOptions}
                rowsData={transfers ?? []}
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
                            Header: "Date",
                            accessor: "date",
                            Cell: dateFormat()
                        },
                        {
                            Header: "Reference",
                            accessor: "ref",

                        },
                      
                        {
                            Header: "From Warehouse",
                            accessor: "fromWarehouse.name",


                        },
                        {
                            Header: "To Warehouse",
                            accessor: "toWarehouse.name",


                        },
                        {
                            Header: "Items",
                            accessor: "items",
                            Cell: numberFormat()

                        },
                        {
                            Header: "Grand total",
                            accessor: "grandTotal",
                            Cell: numberFormat(undefined,{currency:defaultCurrency?.code,style:"currency"})

                        },
                        {
                            Header: "Status",
                            accessor: "status",


                        },
                        
                        {
                            Header: "Actions",
                            accessor: "id",
                            disableSortBy: true,
                            Cell: ({ row, value }: { row: any, value: any }) => {
                                return <div className="flex flex-row gap-2">
                                    <button onClick={(e) => {
                                        router.push(`/transfers/view/${value}`)

                                    }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                    <button onClick={(e) => {
                                        
                                        router.push(`/transfers/update/${value}`);
                                    }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                    <button 
                                    onClick={()=>{
                                        showConfirmDialog(()=>{
                                             showProgress({ animated: true });;
                                            dResult.mutate(value);
                                        })
                                    }}
                                    className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                                </div>
                            }
                        },

                    ]
                }} />
        </div>
    </div>
    </FormContainer>
}

type TransferListProps = ReturnType<typeof useViewRequiredData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <Transfers {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;

function useViewRequiredData(){
        const transfers = useTransfers();
        const {data,isLoading} = useAppConfig();
        return { data:{...data,...transfers}, isLoading: transfers.result.isLoading||isLoading }
    
}