import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { CustomTable } from "@/components/table";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useProducts } from "@/lib/hooks/useProducts";
import { numberFormat } from "@/lib/util";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";




function StockReports({ products, defaultCurrency }: StockReportsProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const requestPrint = useReactToPrint({ content: () => componentRef.current });


  return (
    <FormContainer title={<h2>Stock Reports </h2>}>
      <div className="flex justify-end">
        <button onClick={() => { requestPrint() }} className="btn btn-sm btn-info btn-outline">Print</button>
      </div>
      <div ref={componentRef} className="w-full">
      <CustomTable
        printTitle={"Purchases"}
        pageOptions={pageOptions}
        rowsData={products}
        collumsData={() => ([
          {
            Header: "Code",
            accessor: "code",
            Cell: ({ value }: { value: any }) => {
              return <th>{value}</th>;
            }
          },
          {
            Header: "Name",
            accessor: "name",

          },
          {
            Header: "Category",
            accessor: "category.name"
          },
          {
            Header: "Cost",
            accessor: "cost",
            Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency', maximumFractionDigits: 2 })
          },
          {
            Header: "Price",
            accessor: "price",
            Cell: numberFormat(undefined, { currency: defaultCurrency?.code, style: 'currency', maximumFractionDigits: 2 })
          },
          {
            Header: "In Stock",
            accessor: "productWarehouse",
            Cell: ({ row: { original } }: { row: { original: StockReportsProps['products'][0] } }) => {
              const total = original.productWarehouse.reduce((p, c, i, arr) => p + c.qty, 0)
              const v = numberFormat(undefined, { maximumFractionDigits: 2 })({ value: total })
              const unit = original?.productUnit;
              return <span>{v}<span className="text-primary text-sm pl-2">{unit?.shortName}</span></span>
            }
          }
        ])} />
    </div>
    </FormContainer >
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useStockReportsRequiredData}>
      {(props) => {
        return <StockReports {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}



Index.getLayout = getLayout;


function useStockReportsRequiredData() {
  const router = useRouter();
  const { data, isLoading } = useAppConfig()
  const { products, result: { isLoading: loading } } = useProducts()
  return { data: { ...data, products, }, isLoading: isLoading || loading };
}
type StockReportsProps = ReturnType<
  typeof useStockReportsRequiredData
>["data"];