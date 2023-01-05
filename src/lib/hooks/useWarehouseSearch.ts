import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Prisma, Warehouse } from '@prisma/client';
import { useSearch ,TSearchArgs} from "@/lib/hooks/useSearch";
import { WarehouseFindManySchema } from "prisma/generated/schemas/findManyWarehouse.schema";
import { z } from "zod";





export const warehouseDefaultQueryBuilder = (dText: string):TWarehouseSearchInput => ({
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
                mobile: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
            {
                zip: {
                    startsWith: dText,
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
                city: {
                    startsWith: dText,
                    mode: Prisma.QueryMode.insensitive
                }
            },
        ]
    },
    distinct:["id"]
})

const warehouseDefaultFormater=(data:any)=>data
export type TWarehouseSearchInput = z.infer<typeof WarehouseFindManySchema>;

export function useWarehouseSearch<S extends Warehouse = Warehouse, Q extends TWarehouseSearchInput = TWarehouseSearchInput, L extends any = any>(
    {
        queryBuilder, format, defaultQuery, debounce,
    }: TSearchArgs<Array<S>, Q, L> = {
        queryBuilder: warehouseDefaultQueryBuilder,
        format: warehouseDefaultFormater,
        defaultQuery: { take: 0 },
    } as TSearchArgs<Array<S>, Q, L>) {
    const trpc = useTrpcTenant();
    const [warehouses, setValue] = useState<Array<S>>([]);


    const { query,text, labels, setSearchText } = useSearch({
        state: warehouses,
        queryBuilder,
        format,
        defaultQuery,
        debounce
    });




    const result = trpc.setting.warehouse.search.useQuery(query, {
        onSuccess: (data) => {
            setValue(data as unknown as S[]);
        }
    });

    return [warehouses, result, labels, setSearchText,text] as [typeof warehouses, typeof result, typeof labels, typeof setSearchText,string];
}
