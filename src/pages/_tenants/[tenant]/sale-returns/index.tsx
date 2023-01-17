import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useSaleReturns } from "@/lib/hooks/useSaleReturns";
import { PaymentSaleReturn, SaleReturn } from "@prisma/client";
import { useRouter } from "next/router";


export function SaleReturns({ saleReturns, refetch }: SaleReturnListProps) {
    const router = useRouter();
    const dateFm = new Intl.DateTimeFormat()
    const currencyFormat = new Intl.NumberFormat()

    return <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        router.push("/sale-returns/create")

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
                rowsData={saleReturns ?? []}
                collumsData={() => {

                    return [
                        {
                            Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                            ,
                            accessor: "id",
                            width: 24,
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
                            Header: "Added by",
                            accessor: "user.name",

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
                            Header: "Grand total",
                            accessor: "grandTotal",
                            Cell: ({ value }: { value: number }) => currencyFormat.format(value ?? 0)

                        },
                        {
                            Header: "Paid",
                            accessor: "paidAmount",
                            Cell: ({ value }: { value: number }) => currencyFormat.format(value ?? 0)
                        },
                        {
                            Header: "Due",
                            accessor: "paymentSaleReturns",
                            Cell: ({ row, value }: { row: any, value: any }) => {
                                const saleReturn = row.original as SaleReturn & {
                                    paymentSaleReturns: PaymentSaleReturn[]
                                }
                                const payments = saleReturn.paymentSaleReturns.map((v) => v.amount - v.change).reduce((v, cv, i, arr) => v + cv, 0)
                                const due = saleReturn.grandTotal - payments;
                                return currencyFormat.format(due ?? 0);
                            }
                        }, {
                            Header: "Payment status",
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
                                        router.push(`/sale-returns/update/${id}`);
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

type SaleReturnListProps = ReturnType<typeof useSaleReturns>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = useSaleReturns();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <SaleReturns {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
