import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { createSaleInputSchema } from "@/core/sale/index.zod";
import { createSettingInputSchema, updateSettingInputSchema } from "@/core/setting/index.zod";
import { usePosSetting } from "@/lib/hooks/usePosSetting";
import { useSetting } from "@/lib/hooks/useSetting";
import { useWarehouses } from "@/lib/hooks/useWarehouses";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useCurrencies } from "@/lib/hooks/useCurrencies";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "../../../../components/FormInputField";
import { createPosSettingInputSchema, updatePosSettingInputSchema } from "@/core/pos_setting/index.zod";
import { useMemo } from "react";
import { PosSetting, Setting } from "@prisma/client";


function SettingsIndex() {
  const router = useRouter();
  /* const [tenant] = useTenant();
   const [setting] = useSetting();
   const [customers] = useCustomers();
   const [warehouses] = useWarehouses();
   const [currencies] = useCurrencies()
   // const [posSetting] = usePosSetting();
   const trpc = useTrpcTenant()
   const createSetting = trpc.setting.create.useMutation();
   const updateSetting =  trpc.setting.update.useMutation();
 
   const [config, form] = useZodForm(setting?.id ? updateSettingInputSchema : createSettingInputSchema,
     {
       currencyId: {
         label: "Default Currency",
         ordering: 1,
         options: currencies?.map((v) => ({ label: v.name, value: v.id })),
       } as any,
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
         options: customers?.map((v) => ({ label: v.name, value: v.id }))
 
       },
       warehouseId: {
         label: "Default warehouse",
         ordering: 7,
         options: warehouses?.map((v) => ({ label: v.name, value: v.id }))
       },
       logo: { label: "Change logo", ordering: 8, upload: true },
       footer: { label: "footer", ordering: 9 },
       developedBy: { label: "Developed by", ordering: 10 },
       tenantId: { label: "tenantId", hidden: true, ordering: 11 },
       id: { label: "id", hidden: true, ordering: 12 }
     }, { defaultValues: { tenantId: tenant?.tenantId, ...(setting ?? {}) } })
 
  */

  if (router.isFallback) return <Loader />;


  return (
    <>
      <SystemSettings></SystemSettings>
      <PosSettings></PosSettings>
    </>
  );
}

SettingsIndex.getLayout = getLayout
export default SettingsIndex;



function SystemSettings() {
  const [tenant,t,_t,tr] = useTenant();
  const [setting,s,_s,refetchSetting] = useSetting();
  const [customers, loading, c,cur] = useCustomers();
  const [warehouses, loading1, w, wr] = useWarehouses();
  const [currencies, loading2, cu,c3] = useCurrencies();
  
  const trpc = useTrpcTenant()
  const refetchOpts={
    onSuccess:(data:Setting)=>refetchSetting()
  }
  const createSetting = trpc.setting.create.useMutation(refetchOpts);
  const updateSetting = trpc.setting.update.useMutation(refetchOpts);

  const fieldOptions = useMemo((): Parameters<typeof useZodForm>[1] => {
    return {
      currencyId: {
        label: "Default Currency",
        ordering: 1,
        options: currencies?.map((v) => ({ label: v.name, value: v.id })),
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
        options: customers?.map((v) => ({ label: v.name, value: v.id }))

      },
      warehouseId: {
        label: "Default warehouse",
        ordering: 7,
        options: warehouses?.map((v) => ({ label: v.name, value: v.id }))
      },
      logo: { label: "Change logo", ordering: 8, upload: true },
      footer: { label: "footer", ordering: 9 },
      developedBy: { label: "Developed by", ordering: 10 },
      tenantId: { label: "tenantId", hidden: true, ordering: 11 },
      id: { label: "id", hidden: true, ordering: 12 }
    }
  }, [warehouses, currencies, customers, c, w, cu]);

  const [config, form] = useZodForm(setting?.id ? updateSettingInputSchema : createSettingInputSchema,
    fieldOptions, { defaultValues: { tenantId: tenant?.tenantId, ...(setting ?? {}) } })

    if(loading || loading1 || loading2 ) return <Loader/>


  return (
    <FormContainer title={<h1>System settings </h1>}>
      <form onSubmit={form.handleSubmit(async (data) => {
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


function PosSettings() {
  const [tenant] = useTenant();
  const [posSetting, loading, p,refetchPosSettings] = usePosSetting();
  const fieldOptions = useMemo((): Parameters<typeof useZodForm>[1] => {
    //const options = [{ label: "Yes", value: true }, { label: "No", value: false }]
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
  }, [posSetting, p,loading])

  const [config, form] = useZodForm(posSetting?.id ? updatePosSettingInputSchema : createPosSettingInputSchema,
    fieldOptions,
    { defaultValues: { tenantId: tenant?.tenantId, ...(posSetting ?? {}) } })

  const trpc = useTrpcTenant()
  const refetchOpts={
    onSuccess:(data:PosSetting)=>refetchPosSettings()
  }
  const createSetting = trpc.setting.pos.create.useMutation(refetchOpts);
  const updateSetting = trpc.setting.pos.update.useMutation(refetchOpts);
  if(loading) return <Loader/>
  
  return (
    <FormContainer title={<h1>POS receipt settings </h1>}>
      <form onSubmit={form.handleSubmit(async (data) => {
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