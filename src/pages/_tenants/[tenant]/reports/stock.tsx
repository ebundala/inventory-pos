import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";




function StockReports({}:StockReportsProps){
  return (
    <FormContainer title={<h2>StockReports under construction</h2>}>
         <div></div>
    </FormContainer>
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
    const {data,isLoading} = useAppConfig()
    return { data: { ...data}, isLoading: isLoading};
}
type StockReportsProps = ReturnType<
  typeof useStockReportsRequiredData
>["data"];