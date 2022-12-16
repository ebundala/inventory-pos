import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { getLayout } from "@/layouts/getLayout";
import { useTenant } from "@/lib/hooks/useTenant";
import { useZodForm } from "@/lib/util/form-gen";
import { createSaleInputSchema } from "@/core/sale/index.zod";
import { createSettingInputSchema } from "@/core/setting/index.zod";
import { ZodIssueCode } from "zod";


function SettingsIndex() {
  const router = useRouter();
  const tenant = useTenant();

  const [config, form] = useZodForm(createSettingInputSchema,{
    currencyId:{
      label: "Default Currency",
      ordering:1,
      options:[
        {
          value:null,
          label:""
        },
        {
          value:2,
          label:"TZS"
        },
        {
          value:1,
          label:"KSH"
        }
      ]
    },
   email:{
    label:"Default email",
    ordering:2
   },
  companyName:{label:"Company name",ordering:3},
  companyPhone:{label:"Company phone",ordering:4},
  companyAddress:{label:"Company Address",ordering:4},
  defaultLanguage:{label:"Default languange",ordering:5},
  customerId:{label:"Default customer",ordering:6},
  warehouseId:{label:"Default warehouse",ordering:7},
  logo:{label:"Change logo",ordering:8, upload:true },
  footer:{label:"footer",ordering:9},
  developedBy:{label:"Developed by",ordering:10},
  tenantId:{label:"",hidden:true,ordering:11},
  })


  if (router.isFallback) return <Loader />;


  return (
    <div>
      <h1>Settings </h1>
      {/* {JSON.stringify(tenant)} */}
      <div className="p-4 flex justify-center">
        <form className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-3" onSubmit={form.handleSubmit(async (data) => {
          console.log(data)
          await (new Promise((res) => {
            setTimeout(() => res(data), 10000)
          }))
        }, (e) => {
          console.log(e)
        })}>
          {config.map((i) => {

            return (<div key={i.name} className="form-control">
              <span className="label text-sm ">{`${i.label ?? i.name}${i.required && (i.label ?? i.name) ? '*' : ''}`}</span>
              {i.options?<select {...i.props} className="input input-bordered rounded-md">
                {i.options.map((v)=><option key={(v as any)?.value??v} value={(v as any)?.value??v}>{(v as any)?.label??v} </option>)}
              </select>:<input {...i.props} className="input input-bordered rounded-md" />}
              {i.error &&
                <span className="text text-error text-xs font-semibold">{i.error}</span>
              }

            </div>)
          })}
          <div className="form-control">

            <input type="submit" placeholder="save" className="input btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  );
}

SettingsIndex.getLayout = getLayout
export default SettingsIndex;
