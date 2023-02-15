import { paymentPurchase, paymentPurchaseReturn, paymentSale, paymentSaleReturns, productTopSellers, purchaseReturns, purchases, saleReturns, sales, stockAlerts, topCustomers } from "@/core/report";
import { dateRangeInputSchema } from "@/core/report/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";



export const reportRouter = router({
    productTopSellers: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => productTopSellers(input, ctx as TenantContext)),
        topCustomers: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => topCustomers(input, ctx as TenantContext)),
        sales: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => sales(input, ctx as TenantContext)),
        purchases: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => purchases(input, ctx as TenantContext)),
        saleReturns: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => saleReturns(input, ctx as TenantContext)),
        purchaseReturns: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => purchaseReturns(input, ctx as TenantContext)),
        stockAlerts: privateProcedureWithTx
       // .input(dateRangeInputSchema)
        .query(({ ctx }) => stockAlerts(ctx as TenantContext)),
        paymentSale: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => paymentSale(input, ctx as TenantContext)),
        paymentSaleReturns: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => paymentSaleReturns(input, ctx as TenantContext)),
        paymentPurchase: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => paymentPurchase(input, ctx as TenantContext)),
        paymentPurchaseReturn: privateProcedureWithTx
        .input(dateRangeInputSchema)
        .query(({ input, ctx }) => paymentPurchaseReturn(input, ctx as TenantContext)),

    })