import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Warehouse } from '@prisma/client';
import { sortLabelsByDefaultId } from "@/lib/util/sortLabelsByDefaultId";
import { useWarehouseSearch } from "./useWarehouseSearch";


export function useAdjustmentFormFieldOptions(opts?:{warehouse?: Warehouse | null}) {
     const {warehouse}=opts??{};
    return useMemo((): ZodFormFieldOptions => {


       return {
            warehouseId: {
                label: "Warehouse",
                ordering: 1,
               combobox:{
                elevation:40,
                valuePath:"id",
                value:(warehouse) as any,
                useGetDataHook:useWarehouseSearch
               }
            },
            date: {
                label: "Date",
                ordering: 2
            },
            ref: {
                label: "reference", ordering: 3,
                hidden: true
            },
            notes: {
                label: "Notes",
                textArea: true,
                ordering: 4
            },
            items: {
                hidden: true
            },
            userId: {
                hidden: true
            },
            tenantId: {
                hidden: true
            },
            id: {
                hidden: true
            },
            "adjustmentDetails.0.productId": {
                hidden: true
            },
            "adjustmentDetails.0.id": {
                hidden: true
            },
            "adjustmentDetails.0.productVariantId": {
                hidden: true
            },
            "adjustmentDetails.0.quantity": {
                label: ""
            },
            "adjustmentDetails.0.type": {
                label: "",
                options: [
                    "Addition", "Subtraction"
                ]
            }
        };
}, [warehouse]);
}
