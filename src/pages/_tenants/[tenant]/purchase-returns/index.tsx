/* eslint-disable react-hooks/rules-of-hooks */
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { usePurchaseReturns } from "@/lib/hooks/usePurchaseReturns";
import { PurchaseReturn } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";


export function PurchaseReturns({purchaseReturns,refetch}:QuitationListProps) {
    const router = useRouter();
    


    return(
        <FormContainer title={<h2>All Purchase returns</h2>}>
         <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        router.push("/purchase-returns/create");


                    }
                }
            >create</button>
        </div>

        <CustomTable
            pageOptions={pageOptions}
            rowsData={purchaseReturns ?? []}
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
                        accessor: "grandTotal",
                        Cell:numberFormat(undefined,{maximumFractionDigits:2})
                    },
                    {
                        Header: "Paid",
                        accessor: "paidAmount",
                        Cell:numberFormat(undefined,{maximumFractionDigits:2})

                    },
                    {
                        Header: "Due",
                        accessor: "due",
                        Cell:({row}:{row:any})=>{
                            const v= row.original as PurchaseReturn;
                            const due = v.grandTotal-v.paidAmount;
                            return numberFormat(undefined,{maximumFractionDigits:2})({value:due});

                        }
                    },
                    {
                        Header: "Payment Status",
                        accessor: "paymentStatus"
                    },
                    {
                        Header: "Actions",
                        accessor: "id",
                        disableSortBy: true,
                        Cell: ({ row, value }: { row: any, value: number }) => {
                            return <div className="flex flex-row gap-2">
                                 <button onClick={(e) => {
                                    router.push(`/purchase-returns/view/${value}`)
                                }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>
                 
                                <button onClick={(e) => {                                
                                     router.push(`/purchase-returns/update/${value}`);
                                }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                <button 
                                onClick={()=>{
                                    
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

type QuitationListProps = ReturnType<typeof usePurchaseReturns>

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={() => {
            const data = usePurchaseReturns();
            return { data, isLoading: data.result.isLoading }
        }}>
            {(props) =>
                <PurchaseReturns {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
