import { ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from 'react';
import { renderFieldArrayForm } from "@/lib/util/renderFieldArrayForm";
import { useFieldArray, useForm } from "react-hook-form";

export function useRenderFieldArrayForm(fname: string, fieldArrayForm: ReturnType<typeof useFieldArray>, form: ReturnType<typeof useForm>, fieldArrayConfig: ZodFormFieldConfig[]) {
    const errors = form.formState.errors;
    const len = fieldArrayForm.fields.length;
    return useMemo(() => 
    fieldArrayForm.fields.map((item, i) => {
        return {
            fields: renderFieldArrayForm({
                config: fieldArrayConfig,
                errors, index: i,
                key: item.key,
                register: form.register,
                name: fname
            }), ...item
        };
    }), [len, errors, fname, form.register]);
}
