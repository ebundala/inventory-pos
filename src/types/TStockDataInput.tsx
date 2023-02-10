import { Product, ProductVariant, ProductWarehouse } from "@prisma/client";

export type TStockDataInput = {
  product: Product & {
    productWarehouse: ProductWarehouse[];
  };
  productVariant?: ProductVariant;
};
