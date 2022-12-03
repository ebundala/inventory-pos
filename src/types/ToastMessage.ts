import { ReactNode } from "react";
import { ToastMessageType } from "./ToastMessageType";


export interface ToastMessage {
    id: string;
    content: ReactNode | { (props: { dismiss: () => void; send: (m: ToastMessage) => void; }): ReactNode; };
    type: ToastMessageType;
    timeout: number; //negative number pursistent message
}
