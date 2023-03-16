import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useAdjustments } from "@/lib/hooks/useAdjustments";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { TAppConfig, useAppConfig } from "@/lib/hooks/useAppConfig";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";

function Adjustments({router}:TAppConfig) {

    const [adjustments, loading] = useAdjustments();
    

     
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
     
        <CollectRequiredDataWrapper useHooks={useAppConfig}>
            {(props) => <Adjustments {...props} />}
        </CollectRequiredDataWrapper>
    );
}
Index.getLayout = getLayout;


