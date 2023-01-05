import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Unit } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { UnitFindManySchema } from "prisma/generated/schemas/findManyUnit.schema";
import { z } from "zod";





export const unitDefaultQueryBuilder = (dText: string):TUnitSearchInput => ({
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
                shortName: {
                    contains: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
           
        ]
    },
    distinct:["id"]
})

const unitDefaultFormater=(data:any)=>data
export type TUnitSearchInput = z.infer<typeof UnitFindManySchema>;

export function useUnitSearch<S extends Unit = Unit, Q extends TUnitSearchInput = TUnitSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: unitDefaultQueryBuilder,
        format: unitDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [units, setValue] = useState<Array<S>>([]);


    const { query,text, labels, setSearchText } = useSearch({
        state: units,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.product.unit.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return [units, result, labels, setSearchText,text] as [typeof units, typeof result, typeof labels, typeof setSearchText,string];
}
