import { ReactNode } from "react";
import { ModalData } from "./ModalData";


export type ModalSectionProps = {
    children?: ReactNode | {
        (props?: {
            show: (data: ModalData) => void;
            hide: () => void;
        }): ReactNode;
    };
    className?: string;
};
