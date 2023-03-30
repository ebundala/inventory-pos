import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useSales } from "@/lib/hooks/useSales";
import { PaymentSale, Sale } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function Sales({ sales, defaultCurrency,refetch }: SaleListProps) {
    const router = useRouter();
    const trpcTenant = useTrpcTenant();
    const { showProgress, callbacks } = useProgressFeedback()
    const dResult = trpcTenant.sale.delete.useMutation({
        onSuccess: (data, variable, ctx) => {
          callbacks.onSuccess(data);
          refetch();
        },
        onError: (error) => {
          callbacks.onError(error);
        },
      });
    const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })

    return (<FormContainer title={<h2>All Sales</h2>}>
    <div className="flex flex-col justify-start">
        <div className="flex flex-row justify-end ">
            <button className="btn btn-success btn-sm btn-outline"
                onClick={
                    (e) => {
                        router.push("/sales/create")

                    }
                }
            >create</button>
        </div>
        <div className="w-full ">
            <CustomTable
                pageOptions={pageOptions}
                rowsData={sales ?? []}
                collumsData={() => {

                    return [
                        {
                            Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                            ,
                            accessor: "tenantId",
                            width: 24,
                            disableSortBy: true,
                            Cell: ({ row, value }: { row: any, value: any }) => {
                                return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                            }
                        },
                        {
                            Header: "Date",
                            accessor: "date",
                            Cell:dateFormat()
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
                            Cell: numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})

                        },
                        {
                            Header: "Paid",
                            accessor: "paidAmount",
                            Cell: numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})
                        },
                        {
                            Header: "Due",
                            accessor: "paymentSales",
                            Cell: ({ row, value }: { row: any, value: any }) => {
                                const sale = row.original as Sale & {
                                    paymentSales: PaymentSale[]
                                }
                                const payments = sale.paymentSales.map((v) => v.amount - v.change).reduce((v, cv, i, arr) => v + cv, 0)
                                const due = sale.grandTotal - payments;
                                return numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})({value:due})

                            }
                        }, {
                            Header: "Payment status",
                            accessor: "paymentStatus"
                        },
                         {
                            Header: "Shipping status",
                            accessor: "shippingStatus"
                        },
                        {
                            Header: "Actions",
                            accessor: "id",
                            disableSortBy: true,
                            Cell: ({ row, value }: { row: any, value: any }) => {
                                return <div className="flex flex-row gap-2">
                                    <button onClick={(e) => {
                                        router.push(`/sales/view/${value}`);

                                    }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                    <button onClick={(e) => {
                                        
                                        router.push(`/sales/update/${value}`);
                                    }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                    <button onClick={()=>{
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
    </div>
    </FormContainer>)
}

type SaleListProps = ReturnType<typeof useViewRequiredData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <Sales {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;

function useViewRequiredData(){
    const sales = useSales();
    const {data,isLoading}=useAppConfig();
    return { data:{...data,...sales}, isLoading: sales.result.isLoading||isLoading }
}