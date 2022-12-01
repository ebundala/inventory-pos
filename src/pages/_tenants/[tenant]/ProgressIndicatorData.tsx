import { ReactNode } from "react";


export interface ProgressIndicatorData {
    animated?: boolean;
    value?: number;
    speed?: number;
    children?: ReactNode | { (props?: ProgressIndicatorData): ReactNode; };
}
