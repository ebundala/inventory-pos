import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Category } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";
import { z } from "zod";





export const categoryDefaultQueryBuilder = (dText: string):TCategorySearchInput => ({
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
                    contains: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            
        ]
    },
    distinct:["id"]
})

const categoryDefaultFormater=(data:any)=>data
export type TCategorySearchInput = z.infer<typeof CategoryFindManySchema>;

export function useCategorySearch<S extends Category = Category, Q extends TCategorySearchInput = TCategorySearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: categoryDefaultQueryBuilder,
        format: categoryDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [categories, setValue] = useState<Array<S>>([]);


    const { query, labels, setSearchText } = useSearch({
        state: categories,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.product.category.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return [categories, result, labels, setSearchText] as [typeof categories, typeof result, typeof labels, typeof setSearchText];
}
