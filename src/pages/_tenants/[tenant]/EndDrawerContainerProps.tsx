import { ReactNode } from "react";
import { EndDrawerData, WithShow } from "./forms";

export type EndDrawerContainerProps = {
    children?: ReactNode | {
        (props?: {
            update: (data: EndDrawerData & WithShow) => void;
            close: () => void;
            open: () => void;
            reset: () => void;
            toggle: (current: boolean) => void;
        }): ReactNode;
    };
    className?: string;
};
