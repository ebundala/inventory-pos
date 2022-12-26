import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Product, ProductVariant } from '@prisma/client';
import { useSearch } from "./useSearch";
import { TSearchArgs } from "./TSearchArgs";
import { ProductFindManySchema } from "prisma/generated/schemas/findManyProduct.schema";
import { AdjustmentDetailFormat } from "./getProductFormatedName";
import { z } from "zod";

export const productDefaultFormater = <T extends Product&{productVariants:ProductVariant[]} = Product&{productVariants:ProductVariant[]}>(data: T[]) => {
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
                    productVariantId: null,
                    quantity: 0,
                    type: "Addition"
                })
            }
        }
    return list;
}
export const productDefaultQueryBuilder = (dText: string):TProductSearchInput => ({
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
    distinct:["id",'code']
})

export type TProductSearchInput = z.infer<typeof ProductFindManySchema>;

export function useProductSearch<S extends Product = Product, Q extends TProductSearchInput = TProductSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: productDefaultQueryBuilder,
        format: productDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [products, setValue] = useState<Array<S>>([]);


    const { query, labels, setSearchText } = useSearch({
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

    return [products, result, labels, setSearchText] as [typeof products, typeof result, typeof labels, typeof setSearchText];
}
