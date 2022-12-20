import { FC, ReactNode } from "react";
import { ModalSectionProps } from "./ModalSectionProps";
import { ModalPosition } from "./ModalPosition";

export interface ModalData {
    position?: ModalPosition;
    content: ReactNode | 
        FC<{
            show: (data: ModalData) => void;
            hide: () => void;
            ModalContainer: FC<ModalSectionProps>;
            ModalContent: FC<ModalSectionProps>;
            ModalAction: FC<ModalSectionProps>;
        }>;
    };

