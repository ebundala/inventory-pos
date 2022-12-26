import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { useState } from "react";
import { Brand } from '@prisma/client';
import { z } from "zod";
import { BrandFindManySchema } from "prisma/generated/schemas/findManyBrand.schema";

// function ProductCombobox() {
//     const [products, result, labels, setSearchText] = useProductSearch();
//     return (<div className="flex flex-col gap-2">
//         <input type="text" onChange={(e) => {
//             setSearchText(e.target.value);
//         }} className="input input-bordered m-4 input-primary"></input>
//         <div className="flex flex-col gap-2">
//             {labels.map((v) => {
//                 const name = `${v.name}${v.variantName ? `-${v.variantName}` : ""}`
//                 return (<span key={name}>{name}</span>)
//             }
//             )}
//         </div>
//     </div>)
// }
function useBrandsSearch(where: z.infer<typeof BrandFindManySchema>) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const trpc = useTrpcTenant();
    const result = trpc.product.brand.search.useQuery(where, {
        onSuccess: (data) => {
            setBrands(data);
        }
    });
    return [brands, result.isLoading, result.refetch] as [typeof brands, boolean, typeof result.refetch];
}
