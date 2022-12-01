import { WithChildren } from "@/types";
import React from "react";
import { EndDrawerContainerProps } from "./EndDrawerContainerProps";
import { useEndDrawer } from "./useEndDrawer";

export function EndDrawer({ children }: WithChildren) {
    const { data, open, close, update, toggle, reset } = useEndDrawer();
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
            <div className="drawer-content">
                {children}
            </div>
            <div className="drawer-side">
                <label htmlFor="EndDrawer" className="drawer-overlay"></label>
                {/* <ul className="menu p-4 w-38 bg-base-100 text-base-content">
               
                <li><a>Sidebar Item 1</a></li>
                <li><a>Sidebar Item 2</a></li>
            </ul> */}
                {content instanceof Function ? content({
                    open, close, update, toggle, reset,
                    ContentContainer
                }) : content}
            </div>
        </div>
    );
}
