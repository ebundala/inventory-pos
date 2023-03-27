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
import { useCallback } from "react";




function SuppliersReports({suppliersReports,defaultCurrency}:ViewProps){
  return (
    <FormContainer title={<h2>Suppliers Reports</h2>}>
            <div>

<CustomTable
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
          return <SuppliersReports {...props} />;
        }}
      </CollectRequiredDataWrapper>
    );
  }



Index.getLayout = getLayout;


function useViewRequiredData() {
    const router = useRouter();
    const {data,isLoading} = useAppConfig();
    const suppliers = useSuppliersReports()
    return { data: { ...data,...suppliers}, isLoading: isLoading || suppliers.result.isLoading};
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];


export function useSuppliersReports() {
  const [suppliersReports, setSuppliersReports] = useStore((s) => s.suppliersReports);
  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.report.supplierReports.useQuery(undefined, {
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