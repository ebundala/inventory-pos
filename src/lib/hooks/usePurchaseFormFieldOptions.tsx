import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Supplier, Warehouse } from '@prisma/client';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useSupplierSearch } from "@/lib/hooks/useSupplierSearch";



export function usePurchaseFormFieldOptions(opts?: { warehouse?: Warehouse; supplier?: Supplier; paidAmount?: number; paymentStatus?: string; }) {
    const { supplier, warehouse, paidAmount, paymentStatus } = opts ?? {};
    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            // options:(warehouses??[]).map((v)=>({label:v.name,value:v.id})),
            combobox: {
                elevation: 30,
                value: warehouse ?? undefined,
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
                value: supplier ?? undefined,
                valuePath: "id",
                displayValuePath: "name",
                useGetDataHook: useSupplierSearch
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
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11
        },
        paidAmount: {
            hidden: true,
            registerOptions: {
                value: paidAmount ?? 0
            }
        },
        paymentStatus: {
            hidden: true,
            registerOptions: {
                value: paymentStatus ?? "Pending"
            }
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
        },
        "purchaseDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true
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
    }), [supplier, warehouse]);
}
