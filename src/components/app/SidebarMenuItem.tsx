import { ReactNode } from "react";
import  SidebarChildMenuItem  from "@/components/app/SidebarChildMenuItem";


export default function SidebarMenuItem({ children, icon, onSelected, selected, text, ...props }: {
    icon: ReactNode;
    text: string;
    selected?: boolean;
    onSelected?: (menus: ReactNode) => void;
    children?: ReturnType<typeof SidebarChildMenuItem>[];
}) {
    const subMenus: ReturnType<typeof SidebarChildMenuItem>[] = [];
    for (let i = 0; i < (children ?? []).length; i++) {
        const v = children![i];
        const props = {
            ...v.props, onSelected: (e: unknown) => {
                if (onSelected) {
                    onSelected(null);
                }

                if (v.props?.onSelected) {
                    v.props.onSelected(e);
                }
            }
        };
        subMenus.push(<SidebarChildMenuItem key={i} {...props} />);
    }
    return (
        <div {...props} onClick={(e) => {
            e.preventDefault();
            if (onSelected) {
                onSelected(subMenus);
            }
        }}


            className={` flex flex-col justify-center items-center w-full border-b-2 
        ${selected ? " border-gray-500" : "border-gray-200"}  pb-2 select-none cursor-pointer`}>
            <div className="m-2 p-0">
                {icon}
            </div>
            <div className="p-0 capitalize select-none">
                {text}
            </div>
        </div>
    );
}
