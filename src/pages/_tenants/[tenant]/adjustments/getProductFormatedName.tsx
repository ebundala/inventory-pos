import { AdjustmentDetail, Product, ProductVariant } from "@prisma/client";

export type AdjustmentDetailFormat = Partial<Omit<AdjustmentDetail,'tenantId'| "createdAt"|"updatedAt"|'adjustmentId'>> & {product:Partial<Product>,productVariant?:Partial<ProductVariant>}

export function getProductFormatedName(v: AdjustmentDetailFormat): string {
    return `${v.product.name}${v.productVariant?.name ? ` - ${v.productVariant.name}` : ""}`;
}
