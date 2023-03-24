import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";




function StockAlerts({}:StockAlertsProps){
  return (
    <FormContainer title={<h2>StockAlerts under construction</h2>}>
         <div></div>
    </FormContainer>
  );
}

export default function Index() {
    return (
      <CollectRequiredDataWrapper useHooks={useStockAlertsRequiredData}>
        {(props) => {
          return <StockAlerts {...props} />;
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