import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { StockAlerts } from "@/components/StockAlerts";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";




function StockAlertsIndex({}:StockAlertsProps){
  return (
    <FormContainer title={<h2>Stock Alerts</h2>}>
        <StockAlerts pagenated/>
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
    const {data,isLoading} = useAppConfig()
    return { data: { ...data}, isLoading: isLoading};
}
type StockAlertsProps = ReturnType<
  typeof useStockAlertsRequiredData
>["data"];