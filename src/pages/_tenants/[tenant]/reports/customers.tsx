import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";




function View({}:ViewProps){
  return (
    <FormContainer title={<h2>View under construction</h2>}>
         <div></div>
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
    const {data,isLoading} = useAppConfig()
    return { data: { ...data}, isLoading: isLoading};
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];