import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Supplier } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { SupplierFindManySchema } from "prisma/generated/schemas/findManySupplier.schema";
import { z } from "zod";





export const supplierDefaultQueryBuilder = (dText: string):TSupplierSearchInput => ({
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
                email: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                phone: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                address: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
        ]
    },
    distinct:["id"]
})

const supplierDefaultFormater=(data:any)=>data
export type TSupplierSearchInput = z.infer<typeof SupplierFindManySchema>;

export function useSupplierSearch<S extends Supplier = Supplier, Q extends TSupplierSearchInput = TSupplierSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: supplierDefaultQueryBuilder,
        format: supplierDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [suppliers, setValue] = useState<Array<S>>([]);


    const { query, labels, setSearchText } = useSearch({
        state: suppliers,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.people.supplier.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return [suppliers, result, labels, setSearchText] as [typeof suppliers, typeof result, typeof labels, typeof setSearchText];
}
