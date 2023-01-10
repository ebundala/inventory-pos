import { useMemo } from "react";
import { useWatch } from "react-hook-form";

export type TComputedFormFieldsResult = { value: any; default: any; path: (string | number)[]; }[];
export type TComputedFormValuesArgs<TResult extends TComputedFormFieldsResult = TComputedFormFieldsResult, TControl extends any = any, TData extends any = any> = {
    control: TControl;
    defaultValue?: TResult;
    compute: (data: TData) => TResult;
};

export function useComputedZodFormValues({ control, defaultValue, compute }: TComputedFormValuesArgs) {
    const data = useWatch({ control, defaultValue });
    return useMemo(() => {
        return compute(data);
    }, [data]);
}
