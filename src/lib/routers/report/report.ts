import { customerReport, CustomerSchema, paymentPurchase, paymentPurchaseReturn, PaymentPurchaseReturnSchema, PaymentPurchaseSchema, paymentSale, paymentSaleReturns, PaymentSaleReturnSchema, PaymentSaleSchema, productTopSellers, ProductTopSellersSchema, purchaseReturns, PurchaseReturnSchema, purchases, PurchasesSchema, saleReturns, SaleReturnSchema, sales, SalesSchema, stockAlerts, SupplierSchema, suppliersReport, topCustomers, TopCustomersSchema } from "@/core/report";
import {  stockAlertInputSchema } from "@/core/report/index.zod";
import { router, privateProcedureWithTx, TenantContext } from "@/core/trpc";



export const reportRouter = router({
    productTopSellers: privateProcedureWithTx
        .input(ProductTopSellersSchema)
        .query(({ input, ctx }) => productTopSellers(input, ctx as TenantContext)),
        topCustomers: privateProcedureWithTx
        .input(TopCustomersSchema)
        .query(({ input, ctx }) => topCustomers(input, ctx as TenantContext)),
        sales: privateProcedureWithTx
        .input(SalesSchema)
        .query(({ input, ctx }) => sales(input, ctx as TenantContext)),
        purchases: privateProcedureWithTx
        .input(PurchasesSchema)
        .query(({ input, ctx }) => purchases(input, ctx as TenantContext)),
        saleReturns: privateProcedureWithTx
        .input(SaleReturnSchema)
        .query(({ input, ctx }) => saleReturns(input, ctx as TenantContext)),
        purchaseReturns: privateProcedureWithTx
        .input(PurchaseReturnSchema)
        .query(({ input, ctx }) => purchaseReturns(input, ctx as TenantContext)),
        stockAlerts: privateProcedureWithTx
        .input(stockAlertInputSchema)
        .query(({input, ctx }) => stockAlerts(input,ctx as TenantContext)),
        paymentSale: privateProcedureWithTx
        .input(PaymentSaleSchema)
        .query(({ input, ctx }) => paymentSale(input, ctx as TenantContext)),
        paymentSaleReturns: privateProcedureWithTx
        .input(PaymentSaleReturnSchema)
        .query(({ input, ctx }) => paymentSaleReturns(input, ctx as TenantContext)),
        paymentPurchase: privateProcedureWithTx
        .input(PaymentPurchaseSchema)
        .query(({ input, ctx }) => paymentPurchase(input, ctx as TenantContext)),
        paymentPurchaseReturn: privateProcedureWithTx
        .input(PaymentPurchaseReturnSchema)
        .query(({ input, ctx }) => paymentPurchaseReturn(input, ctx as TenantContext)),
        customerReports: privateProcedureWithTx.input(CustomerSchema).query(({input,ctx})=>customerReport(input,ctx as TenantContext)),
        supplierReports:privateProcedureWithTx.input(SupplierSchema).query(({input,ctx})=>suppliersReport(input,ctx as TenantContext))
    })