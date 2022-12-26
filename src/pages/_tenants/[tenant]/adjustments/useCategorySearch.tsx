import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Category } from '@prisma/client';
import { z } from "zod";
import { CategoryFindManySchema } from "prisma/generated/schemas/findManyCategory.schema";

function useCategorySearch(where: z.infer<typeof CategoryFindManySchema>) {
    const [categories, setCategoriess] = useState<Category[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.product.category.search.useQuery(where, {
        onSuccess: (data) => {
            setCategoriess(data);
        }
    });
    return [categories, result.isLoading, result.refetch] as [typeof categories, boolean, typeof result.refetch];
}
