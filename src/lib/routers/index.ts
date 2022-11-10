import { router, privateProcedure } from "@/core/trpc";
import { adjustmentRouter } from "./adjustments/adjustment";
import { customerRouter } from "./people/people";
import { productRouter } from "./products/product";
import { purchaseRouter } from "./purchases/purchase";
import { quotationRouter } from "./quotations/quotation";
import { saleRouter } from "./sales/sale";
import { settingRouter } from "./settings/setting";
import { tenantRouter } from "./tenants/tenant";
import { transferRouter } from "./transfers/transfer";


const appRouter = router({
    tenant:tenantRouter,
    product:productRouter,
    adjustment:adjustmentRouter,
    sale:saleRouter,
    purchase:purchaseRouter,
    quotation:quotationRouter,
    setting:settingRouter,
    transfer:transferRouter,
    people:customerRouter
})

export default appRouter;