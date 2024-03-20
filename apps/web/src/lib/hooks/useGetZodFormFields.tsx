import { ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from 'react';


export function useGetZodFormFields(names: string[], config: ZodFormFieldConfig[]) {
    return useMemo(() => {
        let fields = [];
        const otherFields: ZodFormFieldConfig[] = [];
        for (let f of config) {
            if (names.includes(f.name)) {
                fields.push(f);
            } else {
                otherFields.push(f);
            }
        }
        return [fields, otherFields] as [typeof fields, typeof otherFields];
    }, [names, config]);
}
