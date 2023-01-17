import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Customer, Warehouse } from '@prisma/client';
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";

export function useSaleReturnFormFieldOptions(opts?: { warehouse?: Warehouse; customer?: Customer; }) {
    const { customer, warehouse } = opts ?? {};
    const currencyFormat = new Intl.NumberFormat();

    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            combobox: {
                elevation: 30,
                value: warehouse ?? undefined,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useWarehouseSearch
            }
        },
        clientId: {
            label: "Customer",
            ordering: 3,
            combobox: {
                elevation: 30,
                value: customer ?? undefined,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useCustomerSearch
            }
        },

        taxRate: {
            label: "Tax (%)",
            ordering: 4
        },

        discount: {
            label: "Discount",
            ordering: 5
        },
        shipping: {
            label: "Shipping",
            ordering: 6
        },

        status: {
            label: "Status",
            ordering: 7,
            options: [
                "Pending", "Received"
            ]
        },
        paymentStatus: {
            label: "Payment Status",
            ordering: 8,
            options: [
                "Pending", "Partial", "Paid"
            ]
        },
        isPos: { hidden: true, registerOptions: { value: false } },
        notes: {
            label: "Notes",
            textArea: true,
            ordering: 9
        },
        ref: {
            label: "Reference",
            hidden: true,
            ordering: 9
        },
        taxNet: {
            label: "Tax total",
            hidden: true,
            ordering: 10,
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11
        },
        paidAmount: {
            label: "Paying Amount",
        },
        id: { hidden: true },
        userId: {
            hidden: true
        },
        tenantId: {
            hidden: true
        },
        "saleReturnDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "saleReturnDetails.0.price": {
            label: "Unit Price",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 14,
            //hidden: true
        },
        "saleReturnDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
        },
        "saleReturnDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: { format: currencyFormat.format },
        },
        "saleReturnDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 17
        },
        "saleReturnDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 18
        },
        "saleReturnDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },
        "saleReturnDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "saleReturnDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },
        "saleReturnDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },
        "saleReturnDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
        "paymentSaleReturns.0.date": {
            hidden: true
        },
        "paymentSaleReturns.0.ref": {
            hidden: true
        },
        "paymentSaleReturns.0.id": {
            hidden: true
        },
        "paymentSaleReturns.0.userId": {
            hidden: true
        },
        "paymentSaleReturns.0.notes": {
            hidden: true
        },
        "paymentSaleReturns.0.amount": {
            label: "Received Amount",
            ordering: 11
        },
        "paymentSaleReturns.0.reglement": {
            label: "Payment method",
            ordering: 10,
            options: [
                "Cash",
                "Credit Card",
                "Cheque",
                "Mobile",
                "Bank wire",
                "Other"
            ]
        },
        
        "paymentSaleReturns.0.change": {
            label: "Change",
            readonly: { format: currencyFormat.format },
            ordering: 13,
        },
        "paymentSaleReturns.0.saleReturnId":{hidden:true},
    }), [customer, warehouse,]);
}
