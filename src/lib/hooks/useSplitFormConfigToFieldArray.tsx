import { isZodFormFieldArray, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from "react";

export function useSplitFormConfigToFieldArray<T extends ZodFormFieldConfig = ZodFormFieldConfig>(config: T[]) {
    return useMemo(() => {
        const regular: T[] = [];
        const fieldArray: T[] = [];
        for (let v of config) {
            if (isZodFormFieldArray(v.name)) {
                fieldArray.push(v);
            }
            else {
                regular.push(v);
            }
        }
        return [regular, fieldArray] as [T[], T[]];
    }, [config]);
}
