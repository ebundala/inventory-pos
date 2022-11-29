import { useState } from "react";
import SidebarMenuItem from "@/components/app/SidebarMenuItem";

export default function SidebarMenu({ children, isMenuShowing, ...props }: {
    isMenuShowing: boolean;
    children: ReturnType<typeof SidebarMenuItem>[];
}) {

    const [subMenus, setSubMenus] = useState<JSX.Element[] | null>(null);
    const [selected, setSelected] = useState(-1);

    const menus: JSX.Element[] = [];
    for (let i = 0; i < children.length; i++) {
        const v = children[i];
        const props = {
            selected: selected === i,
            onSelected: (v: JSX.Element[]) => {
                if (selected === i || !v) {
                    setSubMenus(() => null);
                    setSelected(() => -1);
                } else {
                    setSubMenus(() => v.length ? v : null);
                    setSelected(() => i);
                }
            }, ...v.props
        };

        menus.push((<SidebarMenuItem {...props} key={i} />));
    }

    return (
        <div {...props} className={` justify-start border-r border-gray-300 h-screen ${subMenus?.length ? "w-1/4" : "w-1/12"} bg-white
        ${isMenuShowing ? "flex" : "hidden"}`}>
            <div className={`py-2 h-full ${subMenus?.length ? "w-1/3" : "w-full"} flex flex-col justify-start items-center border-r border-gray-300`}>
                {menus}
            </div>
            {subMenus?.length && <div className={`py-2 h-full w-2/3 flex flex-col justify-start items-center border-r border-gray-300`}>
                {subMenus}
            </div>}
        </div>
    );
}
