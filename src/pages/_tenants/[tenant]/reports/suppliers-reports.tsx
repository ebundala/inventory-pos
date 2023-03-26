import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useSuppliers } from "@/lib/hooks/useSuppliers";
import { useRouter } from "next/router";




function SuppliersReports({suppliers}:ViewProps){
  return (
    <FormContainer title={<h2>Suppliers Reports under construction</h2>}>
         <div></div>
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
    const {suppliers,result:{isLoading:loading}} = useSuppliers()
    return { data: { ...data,suppliers}, isLoading: isLoading};
}
type ViewProps = ReturnType<
  typeof useViewRequiredData
>["data"];