import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { CustomTable } from "@/components/table";
import { getLayout } from "@/layouts/getLayout"
import { pageOptions } from "@/lib/config/pageOptions";
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useDateFilterForm } from "@/lib/hooks/useDateFilterForm";
import { useProducts } from "@/lib/hooks/useProducts";
import { numberFormat } from "@/lib/util";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";




function StockReports({ products, defaultCurrency,setArgs }: StockReportsProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const requestPrint = useReactToPrint({ content: () => componentRef.current });


  return (
    <FormContainer title={<h2>Stock Reports </h2>}>
       
    
      <div className="flex justify-end">
        <button onClick={() => { requestPrint() }} className="btn btn-sm btn-info btn-outline">Print</button>
      </div>
      <div ref={componentRef} className="w-full">
      <CustomTable
        printTitle={"Stock levels"}
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
  const { data, isLoading } = useAppConfig()
  const [args,setArgs]= useState<Parameters<typeof useProducts>[0]>()
  const { products, result: { isLoading: loading } } = useProducts(args)
  return { data: { ...data, products,setArgs }, isLoading: isLoading || loading };
}
type StockReportsProps = ReturnType<
  typeof useStockReportsRequiredData
>["data"];