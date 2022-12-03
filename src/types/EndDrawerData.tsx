import { FC, ReactNode } from "react";
import { EndDrawerContainerProps } from "./EndDrawerContainerProps";
import { WithShow } from "./forms";

export interface EndDrawerData {
    content: ReactNode | {
        (props: {
            update: (data: EndDrawerData & WithShow) => void;
            close: () => void;
            open: () => void;
            reset: () => void;
            toggle: (current: boolean) => void;
            ContentContainer: FC<EndDrawerContainerProps>;
        }): ReactNode;
    };
}
