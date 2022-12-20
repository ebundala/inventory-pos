import { WithChildren } from "@/types";

export function FormSection({ children }: WithChildren) {
    return (
        <div className="m-auto  bg-gray-100 w-full h-full">
            {children}
        </div>
    );
}
