import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Supplier, Warehouse } from '@prisma/client';
import { useSupplierSearch } from "@/lib/hooks/useSupplierSearch";
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";

export function usePurchaseReturnFormFieldOptions(opts?: { warehouse?: Warehouse; supplier?: Supplier; }) {
    const { supplier, warehouse } = opts ?? {};
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
                value: warehouse,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useWarehouseSearch
            }
        },
        supplierId: {
            label: "Supplier",
            ordering: 3,
            combobox: {
                elevation: 30,
                value: supplier,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useSupplierSearch
            }
        },

        taxRate: {
            label: "Tax (%)",
            ordering: 4,
            min:0,
            registerOptions:{
                value:0
            }
        },

        discount: {
            label: "Discount",
            ordering: 5,
            min:0,
            registerOptions:{
                value:0
            }
        },
        shipping: {
            label: "Shipping",
            ordering: 6,
            min:0,
            registerOptions:{
                value:0
            }
        },

        status: {
            label: "Status",
            ordering: 7,
            options: [
                "Pending", "Received"
            ]
        },
        notes: {
            label: "Notes",
            textArea: true,
            ordering: 8
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
            min:0,
            registerOptions: {
                value: 0
            }
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11
        },
        paidAmount: {
            label: "Paying Amount",            
            min:0,
            registerOptions:{
                value:0
            }
        },
        paymentStatus: {
            label: "Payment Status",
            ordering: 8,
            options: [
                "Pending", "Partial", "Paid"
            ]
        },
        id: { hidden: true },
        userId: {
            hidden: true
        },
       
        "purchaseReturnDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "purchaseReturnDetails.0.cost": {
            label: "Unit Cost",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 14,
            //hidden: true
        },
        "purchaseReturnDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,            
            min:0,
            registerOptions:{
                value:0
            }
        },
        "purchaseReturnDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true
        },
        "purchaseReturnDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 17
        },
        "purchaseReturnDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 18
        },

        "purchaseReturnDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },


        "purchaseReturnDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "purchaseReturnDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },


        "purchaseReturnDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },

        "purchaseReturnDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
        "paymentPurchaseReturns.0.date": {
            hidden: true
        },
        "paymentPurchaseReturns.0.ref": {
            hidden: true
        },
        "paymentPurchaseReturns.0.id": {
            hidden: true
        },
        "paymentPurchaseReturns.0.userId": {
            hidden: true
        },
        "paymentPurchaseReturns.0.notes": {
            hidden: true
        },
        "paymentPurchaseReturns.0.amount": {
            label: "Received Amount",
            ordering: 11,
            min:0,
            registerOptions:{
                value:0
            }
        },
        "paymentPurchaseReturns.0.reglement": {
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
        "paymentPurchaseReturns.0.change": {
            label: "Change",
            readonly: { format: currencyFormat.format },
            ordering: 13,
        },
    }), [supplier, warehouse]);
}
