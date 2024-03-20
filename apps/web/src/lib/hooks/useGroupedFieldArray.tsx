import { ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from "react";

export function useGroupedFieldArray(config: ZodFormFieldConfig[]) {
    return useMemo(() => {
        const fields = new Map<string, ZodFormFieldConfig[]>();
        for (let v of config) {
            const fieldName = v.name.split('.')[0] as string;
            const data = fields.get(fieldName) ?? [];
            data.push(v);
            fields.set(fieldName, data);
        }
        return fields;

    }, [config]);
}
