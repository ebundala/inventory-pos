import { TStockDataInput } from "../../types/TStockDataInput";

export function calculateStock(detail: TStockDataInput, warehouseId?: number) {
  if (detail.product?.isVariant === true) {
    return detail.product.productWarehouse
      ?.filter(
        (v) => v.warehouseId === warehouseId &&
          v.productVariantId === detail.productVariant?.id
      )
      ?.reduce((p, c) => p + c.qty, 0);
  }
  return detail.product.productWarehouse
    ?.filter((v) => v.warehouseId === warehouseId)
    ?.reduce((p, c) => p + c.qty, 0);
}
