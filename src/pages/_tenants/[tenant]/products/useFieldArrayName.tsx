import { ZodFormFieldConfig } from "@/lib/util/form-gen";
import { useMemo } from "react";

export function useFieldArrayName<T extends ZodFormFieldConfig = ZodFormFieldConfig>(config: T[]) {
    return useMemo(() => config[0].name.split(".").slice(0, 1)[0], []);
}
