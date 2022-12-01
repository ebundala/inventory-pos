import Link from "next/link";
import React from "react";
import { LinkMenuData } from "./forms";

export function DrawerNavMenuItem({ menu }: { menu: LinkMenuData; }) {
    const [focusedMenu, setFocusedMenuKey] = useStore((store) => store.drawerFocusedMenuKey);
    const collapsible = (menu.subMenus?.length ?? 0) > 0;
    const menuContent = (<div className="collapse-title flex flex-col items-center">
        {menu.icon} <span className="text-sm mt-2">{menu.name}</span>
    </div>);



    return (<li className={`${collapsible ? "collapse collapse-arrow" : ""} border-b-2`}

        onClick={(e) => {
            if (menu.name === focusedMenu) {
                setFocusedMenuKey({ drawerFocusedMenuKey: undefined });
            }
            else {
                setFocusedMenuKey({ drawerFocusedMenuKey: menu.name });
            }

        }}>
        <input className="hidden " type="checkbox" checked={focusedMenu === menu.name} readOnly />
        {collapsible ? menuContent : <Link href={menu.link}>{menuContent}</Link>}
        {collapsible && <div className="collapse-content" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}>

            <ul className="menu text-xs ">
                {menu.subMenus!.map((submenu) => {
                    return (
                        <li key={submenu.name}>
                            <Link href={submenu.link}>
                                <a>
                                    {submenu.icon}{submenu.name}
                                </a>
                            </Link>
                        </li>);
                })}
            </ul>
        </div>}
    </li>);
}
