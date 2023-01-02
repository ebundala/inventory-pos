import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Customer } from '@prisma/client';
import { z } from "zod";
import { CustomerFindManySchema } from "prisma/generated/schemas/findManyCustomer.schema";

function useCustomerSearch(where: z.infer<typeof CustomerFindManySchema>) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.people.search.useQuery(where, {
        onSuccess: (data) => {
            setCustomers(data);
        }
    });
    return [customers, result.isLoading, result.refetch] as [typeof customers, boolean, typeof result.refetch];
}
