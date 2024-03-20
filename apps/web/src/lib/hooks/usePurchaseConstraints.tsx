import { getValue } from "@/lib/util/form-gen";
import { Control, FieldValues } from "react-hook-form";
import { Prisma, PurchaseDetail } from '@prisma/client';
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { ToastMessageType } from "@/types/ToastMessageType";
import { TStockDataInput } from "@/types/TStockDataInput";




export function usePurchaseConstraints<T extends Control<FieldValues, unknown> = Control<FieldValues, unknown>>(control: T) {
    return useComputedZodFormValues({
        control: control,
        compute: (data, showToast) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = "purchaseDetails";
            if (data) {
                const details = getValue([detailsPath], data);
                const warehouseId = getValue(
                    [Prisma.PurchaseScalarFieldEnum.warehouseId],
                    data
                );
                const supplierId = getValue(
                    [Prisma.PurchaseScalarFieldEnum.supplierId],
                    data
                );

                //warehouse constraints
                if (!warehouseId) {
                    if (supplierId || (details && details instanceof Array && details.length > 0)) {
                        requestIdleCallback(() => {
                            if (showToast != undefined) {
                                showToast({
                                    id: "invalid_warehouse",
                                    content: `Please select a warehouse`,
                                    timeout: 5000,
                                    type: ToastMessageType.error
                                });
                            }
                        });
                    }
                }
                else if (!supplierId) {
                    if (details && details instanceof Array && details.length > 0) {
                        requestIdleCallback(() => {
                            if (showToast != undefined) {
                                showToast({
                                    id: "invalid_supplier",
                                    content: `Please select a supplier`,
                                    timeout: 5000,
                                    type: ToastMessageType.error
                                });
                            }
                        });
                    }
                }

                //stock constraints
                else if (details && details instanceof Array && warehouseId) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<PurchaseDetail> & TStockDataInput;

                            if (detail.quantity != undefined) {
                                if (isNaN(detail.quantity)) {
                                    continue;
                                }
                            }
                            const qty = detail.quantity!;

                            if (qty < 0) {
                                partialData.push(
                                    {
                                        value: 0,
                                        default: 0,
                                        path: [
                                            detailsPath,
                                            i,
                                            Prisma.PurchaseDetailScalarFieldEnum.quantity,
                                        ],
                                    }
                                );
                            }

                        }
                    }
                }

            }
            return partialData;
        },
    });
}
