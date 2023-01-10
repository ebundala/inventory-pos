import { ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from 'react';

export function useGetZodFormField(name: string, fields: ZodFormFieldConfig[]) {
    return useMemo(() => {
        let field;
        const otherFields: ZodFormFieldConfig[] = [];
        for (let f of fields) {
            if (f.name === name) {
                field = f;
            } else {
                otherFields.push(f);
            }
        }
        return [field, otherFields ] as [typeof field,typeof otherFields];
    }, [name, fields]);
}

