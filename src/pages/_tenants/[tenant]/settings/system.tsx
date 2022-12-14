import type { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
//import { getTenantServerSideProps } from "@/lib/tenant-server-props";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { tenantCreateInputSchema } from '@/core/tenant/index.zod'
import { createSaleInputSchema, updateSaleInputSchema } from "@/core/sale/index.zod";
import { ZodFirstPartySchemaTypes, ZodFirstPartyTypeKind } from "zod";
import { createBrandInputSchema } from "@/core/brand/index.zod";
import { createPaymentPurchaseInputSchema } from "@/core/purchase/index.zod";
import { createAdjustmentInputSchema } from "@/core/adjustment/index.zod";

//export const getServerSideProps = getTenantServerSideProps

function SettingsIndex(/*{ tenant }: InferGetServerSidePropsType<typeof getServerSideProps>*/) {
  const router = useRouter();
  const tenant = useTenant();
  const [config, form] = useZodForm(updateSaleInputSchema)
  const getInputType = (i: ZodFirstPartyTypeKind) => {
    if(i == ZodFirstPartyTypeKind.ZodBoolean) return "checkbox";
    if(i == ZodFirstPartyTypeKind.ZodEnum) return "select";

    return i.replace('Zod', '').toLowerCase()
  }
  console.log(tenant);
  if (router.isFallback) return <Loader />;


  return (
    <div>
      <h1>Settings </h1>
      {JSON.stringify(tenant)}
      <div className="p-4 flex justify-evenly">
        <form onSubmit={form.handleSubmit((data) => {
          console.log(data)
        }, (e) => {
          console.log(e)
        })}>
          {config.map((i) => {
            let content;
            
            return (<div key={i.name} className="form-control">
              <span className="label">{`${i.name}${i.required ? '*' : ''}`}</span>
              <input type={getInputType(i.type)} className="input input-bordered rounded-sm"   {...i.props} disabled={form.formState.isSubmitting} />
              {form.formState.errors[i.name] &&
                <span className="text text-error text-xs ">{form.formState.errors[i.name]?.message?.toString()}</span>
              }

            </div>)
          })}
          <div className="form-control">

            <input type="submit" className="btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  );
}

SettingsIndex.getLayout = getLayout
export default SettingsIndex;
