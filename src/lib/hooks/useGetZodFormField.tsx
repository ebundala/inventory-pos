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

export function useGetZodFormFields(names: string[], config: ZodFormFieldConfig[]) {
    return useMemo(() => {
        let fields=[];
        const otherFields: ZodFormFieldConfig[] = [];
        for (let f of config) {
            if (names.includes(f.name)) {
                fields.push(f);
            } else {
                otherFields.push(f);
            }
        }
        return [ fields, otherFields ] as [typeof fields,typeof otherFields];
    }, [names, config]);
}