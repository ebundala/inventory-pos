import { WithChildren } from "@/types";
import React from "react";
import { DrawerNavMenuItem } from "@/components/DrawerNavMenuItem";
import { EndDrawer } from "@/components/EndDrawer";
import { Modal } from "@/components/Modal";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Toast } from "@/components/Toast";
import { useDrawer } from "@/lib/hooks/useDrawer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export function Layout({ children, ...props }: WithChildren) {
   const { data, toggle} = useDrawer();
    const { show, menus } = data ?? {};
    return (
        <div {...props}>
            <Navbar />
            <Toast />
            <Modal />
            <ProgressIndicator />

            <div className="drawer drawer-mobile">
                <input id="my-drawer" type="checkbox" checked={show} className="drawer-toggle" readOnly />


                <div className="drawer-content">
                    {/* <!-- Page content here --> */}
                    <EndDrawer>
                        <Breadcrumb />

                        <div className="flex flex-col flex-1 mx-4 mb-4 mt-2">
                            {children}

                        </div>
                        {/* <div className=" p-2 flex-none flex justify-end items-center">
<Pagination />
</div> */}
                        <div className="flex-none">
                            <Footer />
                        </div>

                    </EndDrawer>

                </div>
                <div className="drawer-side pb-16">
                    <label htmlFor="my-drawer" className="drawer-overlay" onClick={() => {
                        toggle(true);
                    }}></label>

                    <ul className=" w-48 bg-base-100 text-base-content border-r-2 border-gray-100 overflow-x-hidden">
                        {menus?.map((menu) => <DrawerNavMenuItem key={menu.name} menu={menu} />)}
                    </ul>
                </div>
            </div>
        </div>
    );
}
