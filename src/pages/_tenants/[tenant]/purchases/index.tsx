import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { usePurchases } from "@/lib/hooks/usePurchases";
import { Purchase } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";


export function Purchases({purchases,refetch}:QuitationListProps) {
    const router = useRouter();
    const dateFm = new Intl.DateTimeFormat()
    


    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        router.push("/purchases/create");


                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={purchases ?? []}
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
                        Header: "Supplier",
                        accessor: "supplier.name",

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
                        Header: "Paid",
                        accessor: "paidAmount"
                    },
                    {
                        Header: "Due",
                        accessor: "due",
                        Cell:({row}:{row:any})=>{
                            const v= row.original as Purchase;
                            const due = v.grandTotal-v.paidAmount;
                            return due;
                        }
                    },
                    {
                        Header: "Payment Status",
                        accessor: "paymentStatus"
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
                                     router.push(`/purchases/update/${id}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                            </div>
                        }
                    },

                ]
            }} />
    </div>
}

type QuitationListProps = ReturnType<typeof usePurchases>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const data = usePurchases();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <Purchases {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
