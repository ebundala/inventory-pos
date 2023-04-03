import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { StockAlerts } from "@/components/StockAlerts";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useDateFilterForm } from "@/lib/hooks/useDateFilterForm";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";




function StockAlertsIndex({ }: StockAlertsProps) {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const requestPrint = useReactToPrint({ content: () => componentRef.current });

  return (
    <FormContainer title={<h2>Stock Alerts</h2>}>
      
    
      <div className="flex justify-end">
        <button onClick={() => { requestPrint() }} className="btn btn-sm btn-info btn-outline">Print</button>
      </div>
      <div ref={componentRef} className="w-full">
        <StockAlerts pagenated />
      </div>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useStockAlertsRequiredData}>
      {(props) => {
        return <StockAlertsIndex {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}



Index.getLayout = getLayout;


function useStockAlertsRequiredData() {
  const router = useRouter();
  const { data, isLoading } = useAppConfig()
  return { data: { ...data }, isLoading: isLoading };
}
type StockAlertsProps = ReturnType<
  typeof useStockAlertsRequiredData
>["data"];