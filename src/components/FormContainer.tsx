import { ReactNode } from "react";

export function FormContainer({ className, contentClassName, titleClassName, title, children }: {
    className?: string; contentClassName?: string; titleClassName?: string; title: ReactNode; children: ReactNode;
}) {
    return (
        <div className={`flex flex-col  h-full pt-2 m-4 bg-primary rounded-lg  ${className ?? ''}`}>
            <div className={`flex px-4 pb-2 justify-start text-lg font-semibold text-primary-content ${titleClassName ?? ""}`}>
                {title}
            </div>
            <div className={`px-4 py-4 h-fit bg-white ${contentClassName ?? ''}`}>
                {children}
            </div>
        </div>
    );
}
