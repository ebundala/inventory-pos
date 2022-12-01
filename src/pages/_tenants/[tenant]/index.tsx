import { useRouter } from "next/router";
import Loader from "@/components/sites/Loader";
import { useHost } from "@/lib/hooks/useHost";
import useRequireAuth from "@/lib/useRequireAuth";
import { useTenant } from "@/lib/hooks/useTenant";
import { WithChildren } from "@/types";
import { ReactNode } from "react";
import { useThemesList } from "@/lib/hooks/useThemesList";




function TenantIndex() {
    const router = useRouter();
    const tenant = useTenant();
    const session = useRequireAuth();
    const host = useHost();
    const themes = useThemesList()

    if (router.isFallback) return <Loader />;
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
                <FormInput label={"Input label"}/>
                <FormInput label="label input"/>
                <select data-choose-theme>
                <option key="x" value="">Default</option>
                    {themes.map((t)=><option key={t} value={t}>{t}</option>)}
  
  
</select>
                </FormContainer>
            </FormSection>
        </div>
    );
}

export default TenantIndex;

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
function FormInput({ className, labelClassName, inputClassName,label, ...props }: {label?:string, className?: string, labelClassName?: string, inputClassName?: string }) {
    // todo add errors props
    return (
        <div className={`flex flex-col justify-start items-start ${className ?? ''}`}>
            <span className={`text-left text-sm font-medium font-sans ${labelClassName ?? ''}`}> {label}</span>
            <input {...props} id="_input" type="text" className={`mt-2 h-8 text-gray-700 bg-white border-solid border-gray-400 focus:outline-none focus:ring-0 rounded-md placeholder-gray-400 ${inputClassName ?? ''}`}></input>
        </div>
    )
}