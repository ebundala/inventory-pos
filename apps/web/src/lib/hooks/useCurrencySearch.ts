import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Currency } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { CurrencyFindManySchema } from "prisma/generated/schemas/findManyCurrency.schema";
import { z } from "zod";





export const currencyDefaultQueryBuilder = (dText: string):TCurrencySearchInput => ({
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
                symbol: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                code: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            }
        ]
    },
    distinct:["id"]
})

const currencyDefaultFormater=(data:any)=>data
export type TCurrencySearchInput = z.infer<typeof CurrencyFindManySchema>;

export function useCurrencySearch<S extends Currency = Currency, Q extends TCurrencySearchInput = TCurrencySearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: currencyDefaultQueryBuilder,
        format: currencyDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [currencies, setValue] = useState<Array<S>>([]);


    const { query,text, labels, setSearchText } = useSearch({
        state: currencies,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.setting.currency.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return {data:currencies, result,loading:result.isLoading, labels, setSearchText,text};
}
