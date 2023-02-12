import { getValue } from "@/lib/util/form-gen";
import { Control, FieldValues } from "react-hook-form";
import { Prisma, SaleReturnDetail } from '@prisma/client';
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { calculateStock } from "@/lib/util/calculateStock";
import { ToastMessageType } from "@/types/ToastMessageType";
import { TStockDataInput } from "@/types/TStockDataInput";



export function useSaleReturnConstraints<T extends Control<FieldValues, unknown> = Control<FieldValues, unknown>>(control: T) {

    return useComputedZodFormValues({
        control: control,
        compute: (data, showToast) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = "saleReturnDetails";
            if (data) {
                const details = getValue([detailsPath], data);
                const warehouseId = getValue(
                    [Prisma.SaleReturnScalarFieldEnum.warehouseId],
                    data
                );
                const clientId = getValue(
                    [Prisma.SaleReturnScalarFieldEnum.clientId],
                    data
                );

                //warehouse constraints
                if (!warehouseId) {
                    if (clientId || (details && details instanceof Array && details.length > 0)) {
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
                else if (!clientId) {
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
                            let detail = item as Partial<SaleReturnDetail> & TStockDataInput;

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
                                            Prisma.SaleReturnDetailScalarFieldEnum.quantity,
                                        ],
                                    }
                                );
                            }
                            // else if (qty > stock) {
                            //     partialData.push(
                            //         {
                            //             value: stock,
                            //             default: 0,
                            //             path: [
                            //                 detailsPath,
                            //                 i,
                            //                 Prisma.SaleDetailScalarFieldEnum.quantity,
                            //             ],
                            //         }
                            //     );
                            //     requestIdleCallback(() => {
                            //         if (showToast != undefined) {
                            //             showToast({
                            //                 id: i.toString(),
                            //                 content: `Quantity ${qty} is larger than available stock ${stock} \n for item ${getProductFormatedName(detail)}`,
                            //                 timeout: 5000,
                            //                 type: ToastMessageType.error
                            //             });
                            //         }
                            //     });
                            // }
                        }
                    }
                }
            }
            return partialData;
        },
    });
}
