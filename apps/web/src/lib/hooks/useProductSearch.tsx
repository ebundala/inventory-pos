import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Product, ProductVariant, PurchaseDetail, PurchaseReturnDetail, QuotationDetail, SaleDetail, SaleReturnDetail, TransferDetail } from '@prisma/client';
import { useSearch, TSearchArgs } from "@/lib/hooks/useSearch";
import { ProductFindManySchema } from "prisma/generated/schemas/findManyProduct.schema";
import { AdjustmentDetailFormat } from "@/lib/util/getProductFormatedName";
import { z } from "zod";


export type TransferDetailFormat = Partial<Omit<TransferDetail, 'tenantId' | "createdAt" | "updatedAt" | 'transferId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToTransferDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: TransferDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                        cost:product.price,
                        purchaseUnitId: product.unitPurchaseId,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                    })
                }
            } else {
                list.push({
                    product: product,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                    cost:product.price,
                    purchaseUnitId: product.unitPurchaseId,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                })
            }
        }
    return list;
}


export type QuotationDetailFormat = Partial<Omit<QuotationDetail, 'tenantId' | "createdAt" | "updatedAt" | 'quotationId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToQuotationDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: QuotationDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                        //  price:product.price,
                        saleUnitId: product.unitSaleId,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                        imeiNumber: "",

                    })
                }
            } else {
                list.push({
                    product: product,
                    //productVariant: variant,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                    //  price:product.price,
                    saleUnitId: product.unitSaleId,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                    imeiNumber: "",

                })
            }
        }
    return list;
}

export type PurchaseDetailFormat = Partial<Omit<PurchaseDetail, 'tenantId' | "createdAt" | "updatedAt" | 'purchaseId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToPurchaseDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: PurchaseDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                        //  price:product.price,
                        purchaseUnitId: product.unitPurchaseId,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                        imeiNumber: "",

                    })
                }
            } else {
                list.push({
                    product: product,
                    //productVariant: variant,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                    //  price:product.price,
                    purchaseUnitId: product.unitPurchaseId,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                    imeiNumber: "",

                })
            }
        }
    return list;
}


export type SaleDetailFormat = Partial<Omit<SaleDetail, 'tenantId' | "createdAt" | "updatedAt" | 'saleId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToSaleDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: SaleDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                        date: new Date(),
                        //  price:product.price,
                        saleUnitId: product.unitSaleId,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                        imeiNumber: "",

                    })
                }
            } else {
                list.push({
                    product: product,
                    //productVariant: variant,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                    date: new Date(),
                    
                    //  price:product.price,
                    saleUnitId: product.unitSaleId,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                    imeiNumber: "",

                })
            }
        }
    return list;
}


export type PurchaseReturnDetailFormat = Partial<Omit<PurchaseReturnDetail, 'tenantId' | "createdAt" | "updatedAt" | 'purchaseReturnId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToPurchaseReturnDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: PurchaseReturnDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                        //  price:product.price,
                        purchaseUnitId: product.unitPurchaseId as number | undefined,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                        imeiNumber: "",

                    })
                }
            } else {
                list.push({
                    product: product,
                    //productVariant: variant,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                    //  price:product.price,
                    purchaseUnitId: product.unitPurchaseId as number | undefined,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                    imeiNumber: "",

                })
            }
        }
    return list;
}


export type SaleReturnDetailFormat = Partial<Omit<SaleReturnDetail, 'tenantId' | "createdAt" | "updatedAt" | 'saleReturnId'>> & { product: Partial<Product>, productVariant?: Partial<ProductVariant> }

export const productToSaleReturnDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: SaleReturnDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 1,
                       // date: new Date(),
                        //  price:product.price,
                        saleUnitId: product.unitSaleId,
                        taxMethod: product.taxMethod,
                        // taxNet:0,
                        discount: 0,
                        discountMethod: "default",
                        //   total:product.price,
                        imeiNumber: "",

                    })
                }
            } else {
                list.push({
                    product: product,
                    //productVariant: variant,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 1,
                  //  date: new Date(),
                    
                    //  price:product.price,
                    saleUnitId: product.unitSaleId,
                    taxMethod: product.taxMethod,
                    // taxNet:0,
                    discount: 0,
                    discountMethod: "default",
                    //   total:product.price,
                    imeiNumber: "",

                })
            }
        }
    return list;
}


export const productToAdjustmentDetailFormater = <T extends Product & { productVariants: ProductVariant[] } = Product & { productVariants: ProductVariant[] }>(data: T[]) => {
    let list: AdjustmentDetailFormat[] = []
    if (data)
        for (let product of data) {
            if (product.isVariant) {
                for (let variant of product.productVariants) {
                    list.push({
                        product: product,
                        productVariant: variant,
                        productId: product.id,
                        productVariantId: variant.id,
                        quantity: 0,
                        type: "Addition"
                    })
                }
            } else {
                list.push({
                    product: product,
                    productId: product.id,
                    productVariantId: -1,
                    quantity: 0,
                    type: "Addition"
                })
            }
        }
    return list;
}

export const productDefaultQueryBuilder = (dText: string): TProductSearchInput => ({
    take: 5,
    where: {
        OR: [
            {
                name: {
                    contains: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                code: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                productVariants: {
                    some: {
                        name: {
                            contains: dText,
                            mode: Prisma.QueryMode.insensitive

                        }
                    }
                }
            }
        ]
    },
    distinct: ["id", 'code']
})

export type TProductSearchInput = z.infer<typeof ProductFindManySchema>;

export function useProductSearch<S extends Product = Product, Q extends TProductSearchInput = TProductSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: productDefaultQueryBuilder,
        format: productToAdjustmentDetailFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [products, setValue] = useState<Array<S>>([]);


    const { query, text, labels, setSearchText } = useSearch({
        state: products,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.product.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return { data: products, result, loading: result.isLoading, labels, setSearchText, text };
}
