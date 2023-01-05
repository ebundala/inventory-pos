import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Brand } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";
import { z } from "zod";





export const brandDefaultQueryBuilder = (dText: string):TBrandSearchInput => ({
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
                description: {
                    contains: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            
        ]
    },
    distinct:["id"]
})

const brandDefaultFormater=(data:any)=>data
export type TBrandSearchInput = z.infer<typeof BrandFindManySchema>;

export function useBrandSearch<S extends Brand = Brand, Q extends TBrandSearchInput = TBrandSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: brandDefaultQueryBuilder,
        format: brandDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [brands, setValue] = useState<Array<S>>([]);


    const { query,text, labels, setSearchText } = useSearch({
        state: brands,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.product.brand.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return [brands, result, labels, setSearchText,text] as [typeof brands, typeof result, typeof labels, typeof setSearchText,string];
}
