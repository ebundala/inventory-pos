import { getValue } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { TComputedFormFieldsResult } from "@/lib/hooks/useComputedZodFormValues";

export function useSetComputedValues<T extends UseFormReturn<FieldValues, unknown> = UseFormReturn<FieldValues, unknown>>(form: T, data: TComputedFormFieldsResult) {
    useMemo(() => {
        // console.log(data);
        const values = form.getValues();
        for (let v of data) {
            if (getValue(['value'], v) !== getValue(v.path, values)) {
                console.log("changed ", v.value, getValue(v.path, values));
                form.setValue(v.path.join('.'), v.value);
            }
        }
    }, [data]);
}
