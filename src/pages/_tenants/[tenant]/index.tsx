import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import useRequireAuth from "@/lib/useRequireAuth";
import { useTenant } from "@/lib/hooks/useTenant";
import { getLayout } from "@/layouts/getLayout";
import { FormContainer } from "@/components/FormContainer";
import { FormSection } from "@/components/FormSection";
import { useThemesList } from "@/lib/hooks/useThemesList";
import { useEffect } from "react";
import { useChangeTheme } from "@/lib/hooks/useChangeTheme";




function TenantIndex() {
    const router = useRouter();
  //  const [tenant, loading] = useTenant();
    const session = useRequireAuth();
    
    

    if (router.isFallback /* || loading */ ) return <Loader />;
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
                    
                   
                </FormContainer>
            </FormSection>
        </div>
    );
}

export default TenantIndex;
TenantIndex.getLayout = getLayout;


function FormInput({ className, labelClassName, inputClassName, label, ...props }: { label?: string, className?: string, labelClassName?: string, inputClassName?: string }) {
    // todo add errors props
    return (
        <div className={`flex flex-col justify-start items-start ${className ?? ''}`}>
            <span className={`text-left text-sm font-medium font-sans ${labelClassName ?? ''}`}> {label}</span>
            <input {...props} id="_input" type="text" className={`mt-2 h-8 text-gray-700 bg-white border-solid border-gray-400 focus:outline-none focus:ring-0 rounded-md placeholder-gray-400 ${inputClassName ?? ''}`}></input>
        </div>
    )
}