import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { CustomTable } from "@/components/table";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useStore } from "@/lib/context";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { numberFormat } from "@/lib/util";
import { useRouter } from "next/router";
import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";




function View({ customersReports, defaultCurrency, }: ViewProps) {
 const componentRef = useRef<HTMLDivElement | null>(null);
 const requestPrint = useReactToPrint({content:()=>componentRef.current});
  return (
    <FormContainer title={<h2>Customers reports</h2>}>
      <div className="flex justify-end">
           <button onClick={()=>{requestPrint()}} className="btn btn-sm btn-info btn-outline">Print</button>
           </div>
      <div ref={componentRef}>

        <CustomTable
                  printTitle={"Customers"}

          pageOptions={pageOptions}
          rowsData={customersReports ?? []}
          collumsData={() => {
            return [

              {
                Header: "Customer name",
                accessor: "name",
              },

              {
                Header: "Phone",
                accessor: "phone",
              },
              {
                Header: "Total sales",
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
                  const { row: { original }, value }: { value: number, row: { original: typeof customersReports[0] } } = v;
                  const due = original!._sum!.grandTotal! - original!._sum!.paidAmount!;

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
        return <View {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}



Index.getLayout = getLayout;


function useViewRequiredData() {
  const router = useRouter();
  const { data, isLoading } = useAppConfig()
  const customers = useCustomersReports();
  console.log(customers);
  return { data: { ...data, ...customers }, isLoading: isLoading || customers.result.isLoading };
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];


export function useCustomersReports() {
  const [customersReports, setCustomersReports] = useStore((s) => s.customersReports);
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.report.customerReports.useQuery(undefined, {
    onSuccess(data) {
      setCustomersReports({ customersReports: data });
    },
  });
  const refetch = useCallback(async (opts?: Parameters<typeof result.refetch>[0]) => {
    const rResult = await result.refetch(opts);
    if (rResult.isSuccess) {
      setCustomersReports({ customersReports: rResult.data })
    }
    return rResult;
  }, [result.refetch])

  return { customersReports, result, refetch };
}


