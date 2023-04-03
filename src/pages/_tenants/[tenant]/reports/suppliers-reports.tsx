import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { CustomTable } from "@/components/table";
import { SupplierSchema } from "@/core/report";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useStore } from "@/lib/context";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useDateFilterForm } from "@/lib/hooks/useDateFilterForm";
import { useDateFilterText } from "@/lib/hooks/useDateFilterText";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { numberFormat } from "@/lib/util";
import { useCallback, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { z } from "zod";




function SuppliersReports({suppliersReports,defaultCurrency,setArgs,config,form}:ViewProps){
  const componentRef = useRef<HTMLDivElement | null>(null);
  const requestPrint = useReactToPrint({content:()=>componentRef.current});

  const datesText = useDateFilterText(form);

  return (
    <FormContainer title={<h2>Suppliers Reports</h2>}>
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
          printTitle={`Suppliers ${datesText}`}

  pageOptions={pageOptions}
  rowsData={suppliersReports ?? []}
  collumsData={() => {
    return [

      {
        Header: "Supplier name",
        accessor: "name",
      },

      {
        Header: "Phone",
        accessor: "phone",
      },
      {
        Header: "Total purchases",
        accessor: "_count.id",
        Cell: numberFormat()

      },
      {
        Header: "Amount",
        accessor: "_sum.grandTotal",
        Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: "currency" })

      },
      {
        Header: "Paid",
        accessor: "_sum.paidAmount",
        Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: "currency" })

      },
      {
        Header: "Due",
        accessor: "_sum.due",
        Cell: (v: any) => {
          const { row: { original }, value }: { value: number, row: { original: typeof suppliersReports[0] } } = v;
          const due = (original!._sum?.grandTotal??0) - (original!._sum?.paidAmount??0);

          return numberFormat(undefined, { currency: defaultCurrency?.code, style: "currency" })({ value: due })
        }
      },
    ];
  }
}
/>
 </div>
    </FormContainer>
  );
}

export default function Index() {
    return (
      <CollectRequiredDataWrapper useHooks={useViewRequiredData}>
        {(props) => {
          return <SuppliersReports {...props} />;
        }}
      </CollectRequiredDataWrapper>
    );
  }



Index.getLayout = getLayout;


function useViewRequiredData() {
    
    const {data,isLoading} = useAppConfig();
    const [args,setArgs] = useState<Parameters<typeof useSuppliersReports>[0]>();
    const suppliers = useSuppliersReports(args)
    const [config,form] = useDateFilterForm();

    return { data: { ...data,config,form,...suppliers,setArgs}, isLoading: isLoading || suppliers.result.isLoading};
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];


export function useSuppliersReports(args?:z.infer<typeof SupplierSchema>) {
  const [suppliersReports, setSuppliersReports] = useStore((s) => s.suppliersReports);
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.report.supplierReports.useQuery(args??{}, {
    onSuccess(data) {
      setSuppliersReports({ suppliersReports: data });
    },
  });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setSuppliersReports({ suppliersReports: rResult.data })
    }
    return rResult;
  }, [result.refetch])

  return { suppliersReports, result, refetch };
}