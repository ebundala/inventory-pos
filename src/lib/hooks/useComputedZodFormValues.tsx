import { ToastMessage } from "@/types/ToastMessage";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useToast } from "./useToast";

export type TComputedFormFieldsResult = { value: any; default: any; path: (string | number)[]; }[];
export type TComputedFormValuesArgs<TResult extends TComputedFormFieldsResult = TComputedFormFieldsResult, TControl extends any = any, TData extends any = any> = {
    control: TControl;
    defaultValue?: TResult;
    compute: (data: TData,showToast?: (m: ToastMessage) => void) => TResult;
};

export function useComputedZodFormValues({ control, defaultValue, compute }: TComputedFormValuesArgs) {
    const data = useWatch({ control, defaultValue });
    const {showToast} = useToast();
    
    return useMemo(() => {
        return compute(data,showToast);
    }, [data]);
}
