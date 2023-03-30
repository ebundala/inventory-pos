import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useAdjustments } from "@/lib/hooks/useAdjustments";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";

function Adjustments({router,adjustments,refetch}:AdjustmentsProps) {

   const trpcTenant = useTrpcTenant();
   const {showProgress,callbacks}= useProgressFeedback()
   const dResult =  trpcTenant.adjustment.delete.useMutation({
    onSuccess: (data, variable, ctx) => {
      callbacks.onSuccess(data);
      refetch();
    },
    onError: (error) => {
      callbacks.onError(error);
    },
  });
   const showConfirmDialog = useConfirmDialog({message:"You are about to delete this record. This action cannot be reversed, Do you want to continue?"})
     
    return (
    <FormContainer title={<h2>All Adjustments</h2>}>
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    () => {

                     router.push("/adjustments/create");
                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={adjustments ?? []}
            collumsData={() => {

                return [
                    {
                        Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        ,
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: () => {
                            return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        }
                    },
                    {
                        Header: "Date",
                        accessor: "date",
                        Cell: ({ row }: { row: any, value: any }) => {
                            return (row.original.date as Date)?.toLocaleDateString()??"";
                        }
                    },
                    {
                        Header: "Reference",
                        accessor: "ref"
                    },
                    {
                        Header: "Warehouse",
                        accessor: "warehouse.name",

                    },
                    {
                        Header: "Total products",
                        accessor: "items",

                    },
                    {
                        Header: "",
                        accessor: "spacing",
                        disableSortBy: true,

                    },
                    
                    {
                        Header: "Actions",
                        accessor: "id",
                        disableSortBy: true,
                        Cell: ({ row ,value}: { row: any, value: number }) => {
                            return <div className="flex flex-row gap-2">
                                <button onClick={() => {
                                    router.push(`/adjustments/view/${value}`);

                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                <button onClick={() => {                                   
                                    router.push(`/adjustments/update/${value}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button
                                onClick={()=>{
                                    //delete here
                                    showConfirmDialog(()=>{
                                        showProgress();
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
    </FormContainer>
    )
}
export default function Index() {

    return (
     
        <CollectRequiredDataWrapper useHooks={useAdjustmentRequiredData}>
            {(props) => <Adjustments {...props} />}
        </CollectRequiredDataWrapper>
    );
}
Index.getLayout = getLayout;

type AdjustmentsProps = ReturnType<typeof useAdjustmentRequiredData>["data"]
function useAdjustmentRequiredData(){
    const config = useAppConfig();
    const adjustments = useAdjustments();
    return {data:{...config.data,...adjustments},isLoading:adjustments.isLoading||config.isLoading}
}
