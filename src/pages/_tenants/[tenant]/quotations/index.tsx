import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { CustomTable } from "@/components/table"
import { getLayout } from "@/layouts/getLayout"
import { useQuotations } from "@/lib/hooks/useQuotations";
import { useRouter } from "next/router";
import { pageOptions } from "@/lib/config/pageOptions";
import { FormContainer } from "@/components/FormContainer";
import { dateFormat, numberFormat } from "@/lib/util";
import { useAppConfig } from "@/lib/hooks/useAppConfig";


export function Quotations({ quotations,defaultCurrency, refetch }: QuitationListProps) {
    const router = useRouter();
    



    return (
        <FormContainer title={<h2>All Quotations</h2>}>
            <div className="flex flex-col justify-start">
                <div className="flex flex-row justify-end ">
                    <button className="btn btn-success btn-sm btn-outline"
                        onClick={
                            (e) => {

                                router.push("/quotations/create")
                            }
                        }
                    >create</button>
                </div>

                <CustomTable
                    pageOptions={pageOptions}
                    rowsData={quotations ?? []}
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
                                accessor: "grandTotal",
                                Cell:numberFormat(undefined,{currency:defaultCurrency?.code,style: 'currency'})

                            },

                            {
                                Header: "Actions",
                                accessor: "id",
                                disableSortBy: true,
                                Cell: ({ row, value }: { row: any, value: number }) => {
                                    return <div className="flex flex-row gap-2">
                                        <button onClick={(e) => {
                                            router.push(`/quotations/view/${value}`);
                                        }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                                        <button onClick={(e) => {
                                            router.push(`/quotations/update/${value}`);
                                        }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                                        <button 
                                        onClick={(e) => {
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

type QuitationListProps = ReturnType<typeof useViewRequiredData>['data']

export default function Index() {
    return (
        <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
            {(props) =>
                <Quotations {...props} />
            }
        </CollectRequiredDataWrapper>
    );
}

Index.getLayout = getLayout;

function useViewRequiredData() {
    const quotations = useQuotations();
    const {data,isLoading} = useAppConfig();
    return { data:{...data,...quotations}, isLoading: quotations.result.isLoading || isLoading}
}