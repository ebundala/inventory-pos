import { useCallback } from "react";
import { FieldValues, UseFieldArrayReturn } from "react-hook-form";
import { ToastMessageType } from "@/types/ToastMessageType";
import { useToast } from "@/lib/hooks/useToast";

export function useEnforceUniqueProduct<R extends UseFieldArrayReturn<FieldValues, string, "key">, T extends { productId: number; productVariantId?: number; } = { productId: number; productVariantId?: number; }>(
    form: R) {
    const { showToast, messages } = useToast();

    const check = useCallback((data: T) => {
        const index = form.fields.findIndex((e) => {
            const v = e as unknown as T;
            if (v.productVariantId != -1 && v.productVariantId !== null && v.productVariantId !== undefined
                && data?.productVariantId != -1 && data?.productVariantId !== null && data?.productVariantId !== undefined) {
                return v.productId === data?.productId && v.productVariantId === data?.productVariantId;
            } else {
                return v.productId === data?.productId;
            }
        });
        if (index > -1) {
            showToast({
                id: Date.now().toString(),
                content: "This item is already selected",
                type: ToastMessageType.warning, timeout: 3000
            });
        } else {
            if (data !== undefined) {
                form.append(data);
            }
        }
    }, [form]);
    //const reset = useCallback(()=>setData(undefined),[setData])
    return check;
}
