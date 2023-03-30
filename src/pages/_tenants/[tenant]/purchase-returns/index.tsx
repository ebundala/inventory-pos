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
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useConfirmDialog } from "@/lib/hooks/useConfirmDialog";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";


export function PurchaseReturns({ purchaseReturns, defaultCurrency, refetch }: PurchaseReturnnListProps) {
    const router = useRouter();

    const trpcTenant = useTrpcTenant();
    const { showProgress, callbacks } = useProgressFeedback("/sales")
    const dResult = trpcTenant.purchase_return.delete.useMutation(callbacks);
    const showConfirmDialog = useConfirmDialog({ message: "You are about to delete this record. This action cannot be reversed, Do you want to continue?" })


    return (
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
                                Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })
                            },
                            {
                                Header: "Paid",
                                accessor: "paidAmount",
                                Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })

                            },
                            {
                                Header: "Due",
                                accessor: "due",
                                Cell: ({ row }: { row: any }) => {
                                    const v = row.original as PurchaseReturn;
                                    const due = v.grandTotal - v.paidAmount;
                                    return numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })({ value: due });

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
        </FormContainer>
    )
}

type PurchaseReturnnListProps = ReturnType<typeof useViewRequiredData>["data"]

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <PurchaseReturns {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;

function useViewRequiredData() {
    const returns = usePurchaseReturns();
    const { data, isLoading } = useAppConfig();
    return { data: { ...returns, ...data }, isLoading: returns.result.isLoading || isLoading }
}