import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { CustomTable } from "@/components/table";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useDateFilterForm } from "@/lib/hooks/useDateFilterForm";
import { useDateFilterText } from "@/lib/hooks/useDateFilterText";
import { useSales } from "@/lib/hooks/useSales";
import { dateFormat, numberFormat } from "@/lib/util";
import { Sale, PaymentSale } from "@prisma/client";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";




function SalesReports({sales,defaultCurrency,setArgs,config,form}:SalesReportsProps){
    const componentRef = useRef<HTMLDivElement | null>(null);
    const requestPrint = useReactToPrint({content:()=>componentRef.current});
    const datesText = useDateFilterText(form);

    return (
    <FormContainer title={<h2>Sales reports</h2>}>
          <form className="flex flex-row justify-start items-center gap-2"
        onSubmit={form.handleSubmit((dates)=>{
          setArgs({where:{
            AND:[{
            date:{
              gte:dates.startAt

            }},
            {
              date:{
                lte:dates.endAt
  
              }}
          ]
          }})
        })}>
        {config.map((v)=><FormInputField key={v.name} {...v}/>)}
        <div className="flex flex-col justify-start">
        <button className="btn btn-xs btn-outline btn-secondary mt-7">Apply</button>
        </div>
        </form>
    
 <div className="flex justify-end">
           <button onClick={()=>{requestPrint()}} className="btn btn-sm btn-info btn-outline">Print</button>
           </div>
      <div ref={componentRef} className="w-full">
            <CustomTable
                      printTitle={`Sales ${datesText}`}

                pageOptions={pageOptions}
                rowsData={sales ?? []}
                collumsData={() => {

                    return [
                       // {
                        //     Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        //     ,
                        //     accessor: "tenantId",
                        //     width: 24,
                        //     disableSortBy: true,
                        //     Cell: ({ row, value }: { row: any, value: any }) => {
                        //         return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
                        //     }
                        // },
                        {
                            Header: "Date",
                            accessor: "date",
                            Cell:dateFormat()
                        },
                        {
                            Header: "Reference",
                            accessor: "ref",

                        },
                        // {
                        //     Header: "Added by",
                        //     accessor: "user.name",

                        // },
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
                        //  {
                        //     Header: "Shipping status",
                        //     accessor: "shippingStatus"
                        // }
                        // {
                        //     Header: "Actions",
                        //     accessor: "id",
                        //     disableSortBy: true,
                        //     Cell: ({ row, value }: { row: any, value: any }) => {
                        //         return <div className="flex flex-row gap-2">
                        //             <button onClick={(e) => {
                        //                 router.push(`/sales/view/${value}`);

                        //             }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

                        //             <button onClick={(e) => {
                                        
                        //                 router.push(`/sales/update/${value}`);
                        //             }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
                        //             <button onClick={()=>{}}
                        //             className="btn btn-warning btn-xs rounded-md btn-outline">Delete</button>
                        //         </div>
                        //     }
                        // },

                    ]
                }} />
        </div>
    </FormContainer>
  );
}

export default function Index() {
    return (
      <CollectRequiredDataWrapper useHooks={useSalesReportsRequiredData}>
        {(props) => {
          return <SalesReports {...props} />;
        }}
      </CollectRequiredDataWrapper>
    );
  }



Index.getLayout = getLayout;


function useSalesReportsRequiredData() {
    const {data,isLoading} = useAppConfig()
    const [args,setArgs]=useState<Parameters<typeof useSales>[0]>()
    const  sales= useSales(args)
    const [config,form] = useDateFilterForm();

    return { data: { ...data,config,form,...sales,setArgs}, isLoading: isLoading||sales.result.isLoading};
}
type SalesReportsProps = ReturnType<
  typeof useSalesReportsRequiredData
>["data"];