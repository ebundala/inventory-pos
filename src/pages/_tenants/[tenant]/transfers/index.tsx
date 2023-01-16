import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useTransfers } from "@/lib/hooks/useTransfers";
//import { useTransfers } from "@/lib/hooks/useTransfers";
import { useRouter } from "next/router";


export function Transfers({ transfers, refetch }: TransferListProps) {
    const router = useRouter();
    const dateFm = new Intl.DateTimeFormat()
    const currencyFormat = new Intl.NumberFormat()

    return <div className="flex flex-col justify-start">
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
                pageOptions={[
                    {
                        label: "5 item per page",
                        value: 5
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
                rowsData={transfers ?? []}
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


                        },
                        {
                            Header: "Grand total",
                            accessor: "grandTotal",
                            Cell: ({ value }: { value: number }) => currencyFormat.format(value ?? 0)

                        },
                        {
                            Header: "Status",
                            accessor: "status",


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
                                        router.push(`/transfers/update/${id}`);
                                    }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                    <button className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                                </div>
                            }
                        },

                    ]
                }} />
        </div>
    </div>
}

type TransferListProps = ReturnType<typeof useTransfers>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = useTransfers();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <Transfers {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
