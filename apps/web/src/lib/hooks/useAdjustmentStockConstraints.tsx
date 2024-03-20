import { getValue } from "@/lib/util/form-gen";
import { Control, FieldValues } from "react-hook-form";
import { AdjustmentDetail, Prisma } from "@prisma/client";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { TStockDataInput } from "@/types/TStockDataInput";
import { calculateStock } from "@/lib/util/calculateStock";
import {
  TComputedFormFieldsResult,
  useComputedZodFormValues
} from "@/lib/hooks/useComputedZodFormValues";
import { ToastMessageType } from "@/types/ToastMessageType";

export function useAdjustmentStockConstraints<T extends Control<FieldValues, unknown> = Control<FieldValues, unknown>>(control: T) {
  return useComputedZodFormValues({
    control: control,
    compute: (data, showToast) => {
      const partialData: TComputedFormFieldsResult = [];
      const detailsPath = "adjustmentDetails";
      if (data) {
        const details = getValue([detailsPath], data);
        const warehouseId = getValue(
          [Prisma.AdjustmentScalarFieldEnum.warehouseId],
          data
        );
        if (details && details instanceof Array) {
          for (let i = 0; i < details.length; i++) {
            const item = details[i];
            if (item) {
              let detail = item as Partial<AdjustmentDetail> & TStockDataInput;
              if (detail.type === "Subtraction") {
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
                        Prisma.AdjustmentDetailScalarFieldEnum.quantity,
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
                        Prisma.AdjustmentDetailScalarFieldEnum.quantity,
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
      }
      return partialData;
    },
  });
}
