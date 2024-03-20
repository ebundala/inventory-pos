import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout"
import { useAppConfig } from "@/lib/hooks/useAppConfig";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";




function WarehouseReports({}:WarehouseReportsProps){
  const componentRef = useRef<HTMLDivElement | null>(null);
  const requestPrint = useReactToPrint({content:()=>componentRef.current});
 // const [config,form] = useDateFilterForm();

  return (
    <FormContainer title={<h2>Warehouse Reports</h2>}>
        
        <div className="flex justify-end">

           <button onClick={()=>{requestPrint()}} className="btn btn-sm btn-info btn-outline">Print</button>
           </div>
      <div ref={componentRef} className="w-full">
        </div>
    </FormContainer>
  );
}

export default function Index() {
    return (
      <CollectRequiredDataWrapper useHooks={useWarehouseReportsRequiredData}>
        {(props) => {
          return <WarehouseReports {...props} />;
        }}
      </CollectRequiredDataWrapper>
    );
  }



Index.getLayout = getLayout;


function useWarehouseReportsRequiredData() {
    const router = useRouter();
    const {data,isLoading} = useAppConfig()
    return { data: { ...data}, isLoading: isLoading};
}
type WarehouseReportsProps = ReturnType<
  typeof useWarehouseReportsRequiredData
>["data"];