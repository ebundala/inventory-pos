import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { useHost } from "@/lib/hooks/useHost";
import useRequireAuth from "@/lib/useRequireAuth";
import { useTenant } from "@/lib/hooks/useTenant";
import { WithChildren } from "@/types";
import { ReactNode } from "react";
import { useThemesList } from "@/lib/hooks/useThemesList";
import { getLayout } from "@/layouts/getLayout";
import { createSettingInputSchema } from "@/core/setting/index.zod";
import { ZodAny, ZodFirstPartyTypeKind, ZodTypeAny,ZodRawShape, ZodAnyDef, ZodFirstPartySchemaTypes } from "zod";
import { TenantCreateInputObjectSchema } from "prisma/generated/schemas/objects/TenantCreateInput.schema";




function TenantIndex() {
    const router = useRouter();
    const [tenant, loading] = useTenant();
    const session = useRequireAuth();
    const themes = useThemesList()

    if (router.isFallback || loading) return <Loader />;
    return (
        <div className="flex flex-row flex-wrap w-full h-full justify-between">
            <FormSection >
                {/* <div className="flex flex-col  h-full py-2 m-4 bg-gray-300 rounded-lg">
                    <div className=" flex px-4 justify-start font-semibold text-sm text-gray-800">
                        System settings
                    </div>
                    <div className="flex px-4 py-4 h-[340px] bg-white ">
                        <FormInput></FormInput>
                    </div>
                </div> */}
                <FormContainer title={<h3>System Settings</h3>}>
                    <FormInput label={"Input label"} />
                    <FormInput label="label input" />
                    <select data-choose-theme>
                        <option key="x" value="">Default</option>
                        {themes.map((t) => <option key={t} value={t}>{t}</option>)}


                    </select>
                    <BuildForm />
                </FormContainer>
            </FormSection>
        </div>
    );
}

export default TenantIndex;
TenantIndex.getLayout = getLayout;


function BuildForm() {
    const json = {
        "email": { "_def": { "checks": [], "typeName": "ZodString" } },
        "currencyId": { "_def": { "innerType": { "_def": { "checks": [], "typeName": "ZodNumber" } }, "typeName": "ZodOptional" } },
        "companyName": { "_def": { "checks": [], "typeName": "ZodString" } },
        "companyPhone": { "_def": { "checks": [], "typeName": "ZodString" } },
        "companyAddress": { "_def": { "checks": [], "typeName": "ZodString" } },
        "logo": { "_def": { "innerType": { "_def": { "checks": [], "typeName": "ZodString" } }, "typeName": "ZodOptional" } },
        "footer": { "_def": { "checks": [], "typeName": "ZodString" } }, "developedBy": { "_def": { "checks": [], "typeName": "ZodString" } },
        "customerId": { "_def": { "innerType": { "_def": { "checks": [], "typeName": "ZodNumber" } }, "typeName": "ZodOptional" } },
        "warehouseId": { "_def": { "innerType": { "_def": { "checks": [], "typeName": "ZodNumber" } }, "typeName": "ZodOptional" } },
        "defaultLanguage": { "_def": { "checks": [], "typeName": "ZodString" } },
        "tenantId": { "_def": { "checks": [], "typeName": "ZodString" } }
    }
    
  
    return (
        <div>
            {/* {JSON.stringify(traverseZodSchema(TenantCreateInputObjectSchema as any))} */}
        </div>
    )
}

type ParsedZodFieldType={
    field:string,
    typeName:ZodFirstPartyTypeKind,
    inner?:Array<ParsedZodFieldType>
}
function traverseZodSchema<T  extends ZodFirstPartySchemaTypes=ZodFirstPartySchemaTypes>(schema:T){
    let ast:ParsedZodFieldType[]=[];
    if(schema._def.typeName == ZodFirstPartyTypeKind.ZodObject){
       const shape = schema._def.shape();
       
    for (let key in shape){
        console.debug(key,shape[key])
        // let v = (schema as any)[key] as ZodTypeAny;
        // let def = v._def as ZodAnyDef;
        // let typeName = def?.typeName??ZodFirstPartyTypeKind.ZodUnknown;
        // let innerType = (def as any)?.innerType as ZodTypeAny;
        // let inner;
        // if(innerType)
        // {
        //   inner=  traverseZodSchema(innerType._def)
        // }
        // ast.push({typeName,inner,field:key})
    }
    }

    return ast;
}

function FormSection({ children }: WithChildren) {
    return (
        <div className="m-auto  bg-gray-100 w-full h-full">
            {children}
        </div>
    )
}
function FormContainer({ className, contentClassName, titleClassName, title, children }: {
    className?: string, contentClassName?: string, titleClassName?: string, title: ReactNode, children: ReactNode
}) {
    return (
        <div className={`flex flex-col  h-full py-2 m-4 bg-gray-300 rounded-lg ${className ?? ''}`}>
            <div className={`flex px-4 pb-2 justify-start font-semibold text-sm text-gray-800 ${titleClassName ?? ""}`}>
                {title}
            </div>
            <div className={`grid grid-flow-row grid-cols-3 px-4 py-4 h-fit bg-white ${contentClassName ?? ''}`}>
                {children}
            </div>
        </div>
    )
}
function FormInput({ className, labelClassName, inputClassName, label, ...props }: { label?: string, className?: string, labelClassName?: string, inputClassName?: string }) {
    // todo add errors props
    return (
        <div className={`flex flex-col justify-start items-start ${className ?? ''}`}>
            <span className={`text-left text-sm font-medium font-sans ${labelClassName ?? ''}`}> {label}</span>
            <input {...props} id="_input" type="text" className={`mt-2 h-8 text-gray-700 bg-white border-solid border-gray-400 focus:outline-none focus:ring-0 rounded-md placeholder-gray-400 ${inputClassName ?? ''}`}></input>
        </div>
    )
}