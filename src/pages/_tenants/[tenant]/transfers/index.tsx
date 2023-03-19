import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useTransfers } from "@/lib/hooks/useTransfers";
//import { useTransfers } from "@/lib/hooks/useTransfers";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";


export function Transfers({ transfers, refetch }: TransferListProps) {
    const router = useRouter();
    const dateFm = new Intl.DateTimeFormat()
    const currencyFormat = new Intl.NumberFormat()

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
                            Cell: numberFormat(undefined,{maximumFractionDigits:2})

                        },
                        {
                            Header: "Grand total",
                            accessor: "grandTotal",
                            Cell: numberFormat(undefined,{maximumFractionDigits:2})

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
                                    onClick={()=>{}}
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

type TransferListProps = ReturnType<typeof useTransfers>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
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
