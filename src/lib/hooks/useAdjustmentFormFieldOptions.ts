import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Warehouse } from '@prisma/client';
import { sortLabelsByDefaultId } from "@/lib/util/sortLabelsByDefaultId";


export function useAdjustmentFormFieldOptions(warehouses: Warehouse[]|null,defaultWarehouseId?:number) {
    return useMemo((): ZodFormFieldOptions => {

      const warehouseLabels = sortLabelsByDefaultId(warehouses,defaultWarehouseId);

       return {
            warehouseId: {
                label: "Warehouse",
                ordering: 1,
                options: warehouseLabels
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
}, [warehouses]);
}
