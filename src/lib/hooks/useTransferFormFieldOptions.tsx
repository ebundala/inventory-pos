import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Warehouse } from '@prisma/client';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";

export function useTransferFormFieldOptions(opts?: { fromWarehouse?: Warehouse, toWarehouse?: Warehouse }) {
   // const { toWarehouse, fromWarehouse } = opts ?? {};
    const currencyFormat = new Intl.NumberFormat();
  
    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        fromWarehouseId: {
            label: "From Warehouse",
            ordering: 2,
            combobox: {
                elevation: 30,
                value: opts?.fromWarehouse,
                valuePath: "id",
              // displayValuePath: "name",
                useGetDataHook: useWarehouseSearch
            }
        },
        toWarehouseId: {
            label: "To Warehouse",
            ordering: 2,
            combobox: {
                elevation: 30,
                value: opts?.toWarehouse,
                valuePath: "id",
               // displayValuePath: "name",
                useGetDataHook: useWarehouseSearch
            }
        },

        taxRate: {
            label: "Tax (%)",
            ordering: 4,
            min:0,           
        },

        discount: {
            label: "Discount",
            ordering: 5,
            min:0
        },
        shipping: {
            label: "Shipping",
            ordering: 6,
            min:0
        },

        status: {
            label: "Status",
            ordering: 7,
            options: [
                "Pending", "Completed"
            ]
        },

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
        items: { hidden: true },
        id: { hidden: true },
        userId: {
            hidden: true
        },
        tenantId: {
            hidden: true
        },
        "transferDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "transferDetails.0.cost": {
            label: "Unit Price",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 14,
            //hidden: true
        },
        "transferDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
            min:1
        },
        "transferDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: { format: currencyFormat.format },
        },
        "transferDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 17
        },
        "transferDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 18
        },
        "transferDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },

        "transferDetails.0.purchaseUnitId": {
            label: "transfer unit",
            hidden: true,
            ordering: 31
        },
        "transferDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },
        "transferDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
    }), [opts]);
}
