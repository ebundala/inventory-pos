import { WithChildren } from "@/types";
import React from "react";
import { EndDrawerContainerProps } from "@/types/EndDrawerContainerProps";
import { useEndDrawer } from "@/lib/hooks/useEndDrawer";
import { useThemesList } from "@/lib/hooks/useThemesList";
import { useChangeTheme } from "@/lib/hooks/useChangeTheme";

export function EndDrawer({ children }: WithChildren) {
    const { data, open, close, update, toggle, reset } = useEndDrawer();
    const themes = useThemesList()
    useChangeTheme()  
    const { show, content } = data ?? {};
    function ContentContainer({ children, className, ...props }: EndDrawerContainerProps) {
        return (
            <div className={`p-4 w-38 bg-base-100 text-base-content ${className ?? ""}`} {...props}>
                {children instanceof Function ? children({ open, close, update, toggle, reset }) : children}
            </div>
        );
    }
    return (
        <div className="drawer drawer-end">
            <input id="EndDrawer" type="checkbox" checked={show} onChange={(e) => {
                if (show !== e.target.checked) {
                    e.target.checked ? open() : close();
                }
            }} className="drawer-toggle" />
            <div className="drawer-content overflow-y-visible pb-10">
                {children}
            </div>
            <div className="drawer-side  ">
                <label htmlFor="EndDrawer" className="drawer-overlay"></label>
                {/* <ul className="menu p-4 w-38 bg-base-100 text-base-content">
               
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
            </ul> */}
            <div className="h-full bg-white">
            <div className="form-control p-4">
                <span className="label">Theme</span>
                <select className="select select-bordered rounded-sm" data-choose-theme >
                        <option key="" value="">Default</option>
                        {themes.map((t) => <option key={t} value={t}>{t}</option>)}


                    </select>
            </div>
           
             
                {content instanceof Function ? content({
                    open, close, update, toggle, reset,
                    ContentContainer
                }) : content}
             </div>
            </div>
        </div>
    );
}
