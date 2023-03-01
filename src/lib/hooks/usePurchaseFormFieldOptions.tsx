import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Supplier, Warehouse } from '@prisma/client';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useSupplierSearch } from "@/lib/hooks/useSupplierSearch";



export function usePurchaseFormFieldOptions(opts?: { warehouse?: Warehouse, supplier?: Supplier}) {
    const { supplier, warehouse } = opts ?? {};
    const currencyFormat = new Intl.NumberFormat();

    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1,
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
                "Pending", "Ordered", "Received"
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
            registerOptions:{
                value:0
            }
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11,
            min:0,
            registerOptions:{
                value:0
            }
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
        tenantId: {
            hidden: true
        },
        "purchaseDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "purchaseDetails.0.cost": {
            label: "Unit Cost",
            hideLabel: true,
            readonly: true,
            ordering: 14,
            //hidden: true
        },
        "purchaseDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
            min:1,
            registerOptions:{
                value:1
            }
        },
        "purchaseDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true,
            min:0,
            registerOptions:{
                value:0
            }
        },
        "purchaseDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: true,
            ordering: 17
        },
        "purchaseDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: true,
            ordering: 18
        },

        "purchaseDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },


        "purchaseDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "purchaseDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },


        "purchaseDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },

        "purchaseDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
        "paymentPurchases.0.date": {
            hidden: true
        },
        "paymentPurchases.0.ref": {
            hidden: true
        },
        "paymentPurchases.0.id":{
            hidden:true
        },
        "paymentPurchases.0.userId":{
            hidden:true
        },
        "paymentPurchases.0.notes": {
            hidden: true
        },
        "paymentPurchases.0.amount": {
            label: "Received Amount",
            ordering: 11,
            min:0,
            registerOptions:{
                value:0
            }
        },
        "paymentPurchases.0.reglement": {
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
        "paymentPurchases.0.change": {
            label: "Change",
            readonly: { format: currencyFormat.format },
            ordering: 13,
            min:0,
            registerOptions:{
                value:0
            }
        },
    }), [supplier, warehouse]);
}
