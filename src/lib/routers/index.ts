import { router, publicProcedure } from "@/core/trpc";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { adjustmentRouter } from "./adjustments/adjustment";
import { companyRouter } from "./hrm/company";
import { customerRouter } from "./people/customer";
import { productRouter } from "./products/product";
import { purchaseRouter } from "./purchases/purchase";
import { purchaseReturnRouter } from "./purchase_return/purchase_return";
import { quotationRouter } from "./quotations/quotation";
import { reportRouter } from "./report/report";
import { saleRouter } from "./sales/sale";
import { saleReturnRouter } from "./sale_return/sale_return";
import { settingRouter } from "./settings/setting";
import { tenantRouter } from "./tenants/tenant";
import { transferRouter } from "./transfers/transfer";
export {createContext} from '@/core/trpc';


export const appRouter = router({
    tenant:tenantRouter,
    product:productRouter,
    adjustment:adjustmentRouter,
    sale:saleRouter,
    sale_return:saleReturnRouter,
    purchase:purchaseRouter,
    purchase_return:purchaseReturnRouter,
    quotation:quotationRouter,
    setting:settingRouter,
    transfer:transferRouter,
    people:customerRouter,
    hrm:companyRouter,
    report:reportRouter,
    version:publicProcedure.query(()=>({version:"1.0.0-RC-1"}))
})

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;