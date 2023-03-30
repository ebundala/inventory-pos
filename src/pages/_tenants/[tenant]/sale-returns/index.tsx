import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useSaleReturns } from "@/lib/hooks/useSaleReturns";
import { PaymentSaleReturn, SaleReturn } from "@prisma/client";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function SaleReturns({ saleReturns, defaultCurrency, refetch }: SaleReturnListProps) {
    const router = useRouter();
    const trpcTenant = useTrpcTenant();
    const { showProgress, callbacks } = useProgressFeedback()
    const dResult = trpcTenant.sale_return.delete.useMutation({
        onSuccess: (data, variable, ctx) => {
          callbacks.onSuccess(data);
          refetch();
        },
        onError: (error) => {
          callbacks.onError(error);
        },
      });
    const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })


    return (
        <FormContainer title={<h2>All Sales returns</h2>}>
            <div className="flex flex-col justify-start">
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
                        pageOptions={pageOptions}
                        rowsData={saleReturns ?? []}
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
                                    Cell: dateFormat()
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
                                    Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })

                                },
                                {
                                    Header: "Paid",
                                    accessor: "paidAmount",
                                    Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })
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
                                        return numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })({ value: due });

                                    }
                                }, {
                                    Header: "Payment status",
                                    accessor: "paymentStatus"
                                },
                                {
                                    Header: "Actions",
                                    accessor: "id",
                                    disableSortBy: true,
                                    Cell: ({ row, value }: { row: any, value: any }) => {
                                        return <div className="flex flex-row gap-2">
                                            <button onClick={(e) => {
                                                router.push(`/sale-returns/view/${value}`);

                                            }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                            <button onClick={(e) => {

                                                router.push(`/sale-returns/update/${value}`);
                                            }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                            <button
                                                onClick={() => {
                                                    showConfirmDialog(() => {
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
        </FormContainer>
    )
}

type SaleReturnListProps = ReturnType<typeof useViewRequiredData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <SaleReturns {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;
function useViewRequiredData() {
    const returns = useSaleReturns();
    const { data, isLoading } = useAppConfig();
    return { data: { ...data, ...returns }, isLoading: returns.result.isLoading || isLoading }
}