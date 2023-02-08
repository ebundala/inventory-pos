import { router, publicProcedure } from "@/core/trpc";
import { registerOidcActionHandler } from "@/lib/util/registerOidcActionHandler";
import { adjustmentRouter } from "./adjustments/adjustment";
import { companyRouter } from "./hrm/company";
import { customerRouter } from "./people/customer";
import { productRouter } from "./products/product";
import { purchaseRouter } from "./purchases/purchase";
import { purchaseReturnRouter } from "./purchase_return/purchase_return";
import { quotationRouter } from "./quotations/quotation";
import { saleRouter } from "./sales/sale";
import { saleReturnRouter } from "./sale_return/sale_return";
import { settingRouter } from "./settings/setting";
import { tenantRouter } from "./tenants/tenant";
import { transferRouter } from "./transfers/transfer";
export {createContext} from '@/core/trpc';
// register oidc actions handlers
//registerOidcActionHandler();

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
    version:publicProcedure.query(()=>({version:10}))
})

export type AppRouter = typeof appRouter;