import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Customer } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";
import { z } from "zod";





export const customerDefaultQueryBuilder = (dText: string):TCustomerSearchInput => ({
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
            }
        ]
    },
    distinct:["id"]
})

const customerDefaultFormater=(data:any)=>data
export type TCustomerSearchInput = z.infer<typeof CustomerFindManySchema>;

export function useCustomerSearch<S extends Customer = Customer, Q extends TCustomerSearchInput = TCustomerSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: customerDefaultQueryBuilder,
        format: customerDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [customers, setValue] = useState<Array<S>>([]);


    const { query,text, labels, setSearchText } = useSearch({
        state: customers,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.people.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return {data:customers, result,loading:result.isLoading, labels, setSearchText,text};
}
