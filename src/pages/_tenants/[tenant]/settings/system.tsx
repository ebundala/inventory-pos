import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { createSettingInputSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { usePosSetting } from "@/lib/hooks/usePosSetting";
import { useSetting } from "@/lib/hooks/useSetting";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { createPosSettingInputSchema, updatePosSettingInputSchema } from "@/core/pos_setting/index.zod";
import { useEffect, useMemo } from "react";
import { Currency, Customer, PosSetting, Setting, Warehouse } from "@prisma/client";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useCurrencySearch } from "@/lib/hooks/useCurrencySearch";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";


function SettingsIndex() {
  const router = useRouter();
 

  if (router.isFallback) return <Loader />;


  return (
    <>
      <CollectRequiredDataWrapper useHooks={useSettingRequiredData}>
        {(props)=>
      <SystemSettings {...props}/>
      }
      </CollectRequiredDataWrapper>
      <CollectRequiredDataWrapper useHooks={usePosRequiredData}>
        {(props)=>
      <PosSettings {...props}/>
      }
      </CollectRequiredDataWrapper>
    </>
  );
}

SettingsIndex.getLayout = getLayout
export default SettingsIndex;

function useSettingRequiredData(){
  const {tenant,result:{isLoading:tenantLoading},refetch:refetchTenant} = useTenant();
  const {setting,result:{isLoading:settingLoading},refetch:refetchSetting} = useSetting();
 
return {data:{tenant,setting,refetchSetting,refetchTenant},isLoading:tenantLoading||settingLoading}
}

type SystemSettingsProps = ReturnType<typeof useSettingRequiredData>['data']
function SystemSettings({tenant,setting,refetchTenant,refetchSetting}:SystemSettingsProps) {
 
  
  const trpc = useTrpcTenant()
  const {showProgress,callbacks} = useProgressFeedback()

  const refetchOpts={
    onSuccess:(data:Setting)=>{
      callbacks.onSuccess(data);
      refetchSetting()
    },
    onError:callbacks.onError
  }
  const createSetting = trpc.setting.create.useMutation(refetchOpts);
  const updateSetting = trpc.setting.update.useMutation(refetchOpts);

  const fieldOptions = useMemo((): Parameters<typeof useZodForm>[1] => {
    return {
      currencyId: {
        label: "Default Currency",
        ordering: 1,       
        combobox:{
          value:setting?.currency as Currency | undefined,
          useGetDataHook:useCurrencySearch
        },
      },
      email: {
        label: "Default email",
        ordering: 2
      },
      companyName: { label: "Company name", ordering: 3 },
      companyPhone: { label: "Company phone", ordering: 4 },
      companyAddress: { label: "Company Address", ordering: 4 },
      defaultLanguage: { label: "Default languange", ordering: 5 },
      customerId: {
        label: "Default customer",
        ordering: 6,
        combobox:{
          value:setting?.customer as Customer | undefined,
          useGetDataHook:useCustomerSearch
        },

      },
      warehouseId: {
        label: "Default warehouse",
        ordering: 7,
        combobox:{
          value:setting?.warehouse as Warehouse | undefined,
          useGetDataHook:useWarehouseSearch
        },
      },
      logo: { label: "Change logo", ordering: 8, upload: true },
      footer: { label: "footer", ordering: 9 },
      developedBy: { label: "Developed by", ordering: 10 },
      tenantId: { label: "tenantId", hidden: true, ordering: 11 },
      id: { label: "id", hidden: true, ordering: 12 }
    }
  }, [setting]);

  const [config, form] = useZodForm(setting?.id ? updateSettingInputSchema : createSettingInputSchema,
    fieldOptions, { defaultValues: { tenantId: tenant?.tenantId, ...(setting ?? {}) } })

   useEffect(()=>{
    if(setting){
      form.reset(setting);
    }
   },[setting])

  return (
    <FormContainer title={<h1>System settings </h1>}>
      <form onSubmit={form.handleSubmit(async (data) => {
        showProgress({animated:true});
        await (setting?.id ? updateSetting.mutateAsync(data as any) : createSetting.mutateAsync(data as any));

      }, (e) => {
        console.error(e)
      })}>
        <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
          {config.map((i) => {
            return (<FormInputField key={i.name} {...i} />);
          })}
        </div>
        <div className="flex flex-row py-3 justify-start">

          <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
        </div>
      </form>
    </FormContainer>
  );
}

function usePosRequiredData(){
  const {tenant,result:{isLoading:tenantLoading}} = useTenant();
  const {posSetting, result:{isLoading:posLoading},refetch:refetchPosSettings} = usePosSetting();
return {data:{posSetting,refetchPosSettings,tenant},isLoading:posLoading || tenantLoading}
}

type PosSettingProps = ReturnType<typeof usePosRequiredData>['data']

function PosSettings({tenant,posSetting,refetchPosSettings}:PosSettingProps) {
 
  const fieldOptions = useMemo((): Parameters<typeof useZodForm>[1] => {
    return {
      noteCustomer: {
        label: "Notes",
        textArea: true,
        ordering: 10,
      },
      showNote: {
        label: "Show notes",
        ordering: 6,
      },
      showAddress: {
        label: "Show address",
        ordering: 5,
      },
      showPhone: { label: "Show phone", ordering: 1, },
      showEmail: { label: "Show email", ordering: 2, },
      showBarcode: { label: "Show barcode", ordering: 4, },
      showCustomer: { label: "Show customer", ordering: 3, },
      showDiscount: { label: "Show discount", ordering: 7, },
      id: {
        hidden: true
      },
      tenantId: {
        hidden: true
      }
    }
  }, [])

  const [config, form] = useZodForm(posSetting?.id ? updatePosSettingInputSchema : createPosSettingInputSchema,
    fieldOptions,
    { defaultValues: { tenantId: tenant?.tenantId, ...(posSetting ?? {}) } })

  const trpc = useTrpcTenant()
  const {showProgress,callbacks} = useProgressFeedback()

  const refetchOpts={
    onSuccess:(data:PosSetting)=>{
      callbacks.onSuccess(data);
      refetchPosSettings()
    },
    onError:callbacks.onError
  }
  const createSetting = trpc.setting.pos.create.useMutation(refetchOpts);
  const updateSetting = trpc.setting.pos.update.useMutation(refetchOpts);
  useEffect(()=>{
    if(posSetting){
      form.reset(posSetting)
    }
  },[posSetting]);

  return (
    <FormContainer title={<h1>POS receipt settings </h1>}>
      <form onSubmit={form.handleSubmit(async (data) => {
        showProgress({animated:true})
        await (posSetting?.id ? updateSetting.mutateAsync(data as any) : createSetting.mutateAsync(data as any));

      }, (e) => {
        console.error(e)
      })}>
        <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3">
          {config.map((i) => {
            return (<FormInputField key={i.name} {...i} />);
          })}
        </div>
        <div className="flex flex-row py-3 justify-start">

          <button type="submit" className=" btn btn-primary rounded-md  " >Submit </button>
        </div>
      </form>
    </FormContainer>
  )
}