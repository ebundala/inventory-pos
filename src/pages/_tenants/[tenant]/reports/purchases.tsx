import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { CustomTable } from "@/components/table";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { usePurchases } from "@/lib/hooks/usePurchases";
import { dateFormat, numberFormat } from "@/lib/util";
import { Purchase } from "@prisma/client";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import {useReactToPrint} from "react-to-print"
import { DateFilterArg, useDateFilterForm } from "@/lib/hooks/useDateFilterForm";
import { z } from "zod";
import { useDateFilterText } from "@/lib/hooks/useDateFilterText";



function PurchasesReports({ purchases, defaultCurrency,setArgs }: ViewProps) {

  const componentRef = useRef<HTMLDivElement | null>(null);
 const requestPrint = useReactToPrint({content:()=>componentRef.current});
 const [config,form] = useDateFilterForm()
const datesText = useDateFilterText(form);
  return (
    <FormContainer title={<h2>Purchases Reports</h2>}>
      
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
          printTitle={`Purchases ${datesText}`}
          pageOptions={pageOptions}
          rowsData={purchases ?? []}
          collumsData={() => {

            return [
              // {
              //     Header: () => <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
              //     ,
              //     accessor: "tenantId",
              //     disableSortBy: true,
              //     Cell: ({ row, value }: { row: any, value: any }) => {
              //         return <label ><input type="checkbox" className="checkbox checkbox-primary checkbox-xs " /></label>
              //     }
              // },
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
                  const v = row.original as Purchase;
                  const due = v.grandTotal - v.paidAmount;
                  return numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency' })({ value: due });
                }
              },
              {
                Header: "Payment Status",
                accessor: "paymentStatus"
              },
              // {
              //     Header: "Actions",
              //     accessor: "id",
              //     disableSortBy: true,
              //     Cell: ({ value }: {value: number }) => {
              //         return <div className="flex flex-row gap-2">
              //              <button onClick={(e) => {
              //                 router.push(`/purchases/view/${value}`)

              //             }} className="btn btn-success btn-xs rounded-md btn-outline">View</button>

              //             <button onClick={(e) => {

              //                  router.push(`/purchases/update/${value}`);
              //             }} className="btn btn-info btn-xs rounded-md btn-outline">Edit</button>
              //             <button 
              //             onClick={(e) => {


              //             }}
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
    <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
      {(props) => {
        return <PurchasesReports {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}



Index.getLayout = getLayout;


function useViewRequiredData() {
  const { data, isLoading } = useAppConfig()
  const [args,setArgs] = useState<Parameters<typeof usePurchases>[0]|undefined>();
  const purchases = usePurchases(args);
  return { data: { ...data, ...purchases,setArgs }, isLoading: isLoading || purchases.result.isLoading };
}

type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];