import { router, publicProcedure } from "@/core/trpc";
import { registerOidcActionHandler } from "@/lib/util/registerOidcActionHandler";
import { adjustmentRouter } from "./adjustments/adjustment";
import { companyRouter } from "./hrm/company";
import { customerRouter } from "./people/customer";
import { productRouter } from "./products/product";
import { purchaseRouter } from "./purchases/purchase";
import { quotationRouter } from "./quotations/quotation";
import { saleRouter } from "./sales/sale";
import { settingRouter } from "./settings/setting";
import { tenantRouter } from "./tenants/tenant";
import { transferRouter } from "./transfers/transfer";
export {createContext} from '@/core/trpc';
// register oidc actions handlers
registerOidcActionHandler();

export const appRouter = router({
    tenant:tenantRouter,
    product:productRouter,
    adjustment:adjustmentRouter,
    sale:saleRouter,
    purchase:purchaseRouter,
    quotation:quotationRouter,
    setting:settingRouter,
    transfer:transferRouter,
    people:customerRouter,
    hrm:companyRouter,
    version:publicProcedure.query(()=>({version:10}))
})

export type AppRouter = typeof appRouter;