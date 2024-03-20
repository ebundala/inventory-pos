import { getValue } from "@/lib/util/form-gen";
import { Control, FieldValues } from "react-hook-form";
import { Prisma, QuotationDetail } from '@prisma/client';
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { calculateStock } from "@/lib/util/calculateStock";
import { TStockDataInput } from "@/types/TStockDataInput";
import { ToastMessageType } from "@/types/ToastMessageType";




export function useQuotationConstraints<T extends Control<FieldValues, unknown> = Control<FieldValues, unknown>>(control: T) {
    return useComputedZodFormValues({
        control: control,
        compute: (data, showToast) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = "quotationDetails";
            if (data) {
                const details = getValue([detailsPath], data);
                const warehouseId = getValue(
                    [Prisma.QuotationScalarFieldEnum.warehouseId],
                    data
                );
                const customerId = getValue(
                    [Prisma.QuotationScalarFieldEnum.customerId],
                    data
                );

                //warehouse constraints
                if (!warehouseId) {
                    if (customerId || (details && details instanceof Array && details.length > 0)) {
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
                else if (!customerId) {
                    if (details && details instanceof Array && details.length > 0) {
                        requestIdleCallback(() => {
                            if (showToast != undefined) {
                                showToast({
                                    id: "invalid_customer",
                                    content: `Please select a customer`,
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
                            let detail = item as Partial<QuotationDetail> & TStockDataInput;

                            if (detail.quantity != undefined) {
                                if (isNaN(detail.quantity)) {
                                    continue;
                                }
                            }
                            const stock = calculateStock(detail, warehouseId);
                            const qty = detail.quantity!;

                            if (qty < 0) {
                                partialData.push(
                                    {
                                        value: 0,
                                        default: 0,
                                        path: [
                                            detailsPath,
                                            i,
                                            Prisma.QuotationDetailScalarFieldEnum.quantity,
                                        ],
                                    }
                                );
                            } else if (qty > stock) {
                                partialData.push(
                                    {
                                        value: stock,
                                        default: 0,
                                        path: [
                                            detailsPath,
                                            i,
                                            Prisma.QuotationDetailScalarFieldEnum.quantity,
                                        ],
                                    }
                                );
                                requestIdleCallback(() => {
                                    if (showToast != undefined) {
                                        showToast({
                                            id: i.toString(),
                                            content: `Quantity ${qty} is larger than available stock ${stock} \n for item ${getProductFormatedName(detail)}`,
                                            timeout: 5000,
                                            type: ToastMessageType.error
                                        });
                                    }
                                });
                            }

                        }
                    }
                }
            }
            return partialData;
        },
    });
}
