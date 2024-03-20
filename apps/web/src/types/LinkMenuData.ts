import { ReactNode } from "react";




export type LinkMenuData = {
    name: string;
    link: string;
    icon?: ReactNode;
    disabled?: boolean;
    active?: boolean;
    subMenus?: LinkMenuData[];
};
