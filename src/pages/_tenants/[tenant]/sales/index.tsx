import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useQuotations } from "@/lib/hooks/useQuotations";
import { useRouter } from "next/router";


export function Quotations({quotations,refetch}:QuitationListProps) {
    const router = useRouter();
    const dateFm = new Intl.DateTimeFormat()
    


    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {


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
            rowsData={quotations ?? []}
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
                        Header: "Date",
                        accessor: "date",
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return dateFm.format(value);                            
                        }
                    },
                    {
                        Header: "Reference",
                        accessor: "ref"
                    },
                    {
                        Header: "Customer",
                        accessor: "customer.name",

                    },
                    {
                        Header: "Warehouse",
                        accessor: "warehouse.name",

                    },
                    {
                        Header: "Status",
                        accessor: "status",

                    },
                    {
                        Header: "Grand Total",
                        accessor: "grandTotal"
                    },
                    
                    {
                        Header: "Actions",
                        accessor: "tenantId",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: any }) => {
                            return <div className="flex flex-row gap-2">
                                 <button onClick={(e) => {
                                    console.log(row);

                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>
                 
                                <button onClick={(e) => {
                                    const id = row.original.id;
                                    //console.log(row);
                                     router.push(`/quotations/update/${id}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
}

type QuitationListProps = ReturnType<typeof useQuotations>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = useQuotations();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <Quotations {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
