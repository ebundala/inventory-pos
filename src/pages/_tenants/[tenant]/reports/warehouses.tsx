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
        {/* <form className="flex flex-row justify-start items-center gap-2"
        onSubmit={form.handleSubmit((dates)=>{
          setArgs({where:{
            AND:[{
            date:{
              gte:dates.startAt

            }},
            {
              date:{
                lte:dates.endAt
  
              }}
          ]
          }})
        })}>
        {config.map((v)=><FormInputField key={v.name} {...v}/>)}
        <div className="flex flex-col justify-start">
        <button className="btn btn-xs btn-outline btn-secondary mt-7">Apply</button>
        </div>
        </form>
     */}
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