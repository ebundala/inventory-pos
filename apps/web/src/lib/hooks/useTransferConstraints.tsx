import { getValue } from "@/lib/util/form-gen";
import { Control, FieldValues } from "react-hook-form";
import { Prisma, TransferDetail } from '@prisma/client';
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { TComputedFormFieldsResult, useComputedZodFormValues } from "@/lib/hooks/useComputedZodFormValues";
import { ToastMessageType } from "@/types/ToastMessageType";
import { calculateStock } from "@/lib/util/calculateStock";
import { TStockDataInput } from "@/types/TStockDataInput";




 
export function useTransferConstraints<T extends Control<FieldValues, unknown> = Control<FieldValues, unknown>>(control: T) {
   // const [cached,setCached] = useState<string|undefined>(undefined);
      
    return useComputedZodFormValues({
        control: control,
        compute: (data, showToast) => {
            const partialData: TComputedFormFieldsResult = [];
            const detailsPath = "transferDetails";
            if (data) {
                const details = getValue([detailsPath], data);
                const fromWarehouseId = getValue(
                    [Prisma.TransferScalarFieldEnum.fromWarehouseId],
                    data
                );
                const toWarehouseId = getValue(
                    [Prisma.TransferScalarFieldEnum.toWarehouseId],
                    data
                );

                //warehouse constraints
                if (!fromWarehouseId) {
                    if (toWarehouseId || (details && details instanceof Array && details.length > 0)) {
                        requestIdleCallback(() => {
                            if (showToast != undefined) {
                                showToast({
                                    id: "invalid_warehouse",
                                    content: `Please select a source warehouse`,
                                    timeout: 5000,
                                    type: ToastMessageType.error
                                });
                              
                            }
                        });
                    }
                }
                else if (!toWarehouseId) {
                    if (details && details instanceof Array && details.length > 0) {
                        requestIdleCallback(() => {
                            if (showToast != undefined ) {
                                showToast({
                                    id: "invalid_towarehouse",
                                    content: `Please select a destination warehouse`,
                                    timeout: 5000,
                                    type: ToastMessageType.error
                                });
                               
                            }
                        });
                    }
                }

                //limit transfer from same warehouse
                else if (toWarehouseId === fromWarehouseId) {
                    partialData.push(
                        {
                            value: undefined,
                            default: undefined,
                            path: [
                                Prisma.TransferScalarFieldEnum.toWarehouseId,
                            ],
                        }
                    );
                    requestIdleCallback(() => {
                        if (showToast != undefined) {
                            showToast({
                                id: "invalid_transfer",
                                content: `You cant transfer to same warehouse`,
                                timeout: 5000,
                                type: ToastMessageType.error
                            });
                           
                        }
                    });
                }


                //stock constraints
                else if (details && details instanceof Array && fromWarehouseId) {
                    for (let i = 0; i < details.length; i++) {
                        const item = details[i];
                        if (item) {
                            let detail = item as Partial<TransferDetail> & TStockDataInput;

                            if (detail.quantity != undefined) {
                                if (isNaN(detail.quantity)) {
                                    continue;
                                }
                            }
                            const stock = calculateStock(detail, fromWarehouseId);
                            const qty = detail.quantity!;

                            if (qty < 0) {
                                partialData.push(
                                    {
                                        value: 0,
                                        default: 0,
                                        path: [
                                            detailsPath,
                                            i,
                                            Prisma.TransferDetailScalarFieldEnum.quantity,
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
                                            Prisma.TransferDetailScalarFieldEnum.quantity,
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
