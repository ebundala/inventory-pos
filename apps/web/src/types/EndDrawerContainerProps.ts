import { ReactNode } from "react";
import { WithShow } from "./WithShow";
import { EndDrawerData } from "./EndDrawerData";

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
