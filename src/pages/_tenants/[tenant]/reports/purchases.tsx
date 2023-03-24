import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";




function PurchasesReports({}:ViewProps){
  return (
    <FormContainer title={<h2>PurchasesReports under construction</h2>}>
         <div></div>
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
    const router = useRouter();
    const {data,isLoading} = useAppConfig()
    return { data: { ...data}, isLoading: isLoading};
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];