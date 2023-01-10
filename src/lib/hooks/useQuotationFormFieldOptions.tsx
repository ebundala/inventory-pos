import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Customer, Warehouse } from '@prisma/client';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";

export function useQuotationFormFieldOptions(symbol: string, opts?: { warehouse?: Warehouse; customer?: Customer; }) {
    const { customer, warehouse } = opts ?? {};
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
        customerId: {
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
                "Pending", "Sent"
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
        id:{hidden:true},
        userId: {
            hidden: true
        },
        tenantId: {
            hidden: true
        },
        "quotationDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "quotationDetails.0.price": {
            label: "Unit Price",
            hideLabel: true,
            readonly: true,
            ordering: 14,
            //hidden: true
        },
        "quotationDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
        },
        "quotationDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true
        },
        "quotationDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: true,
            ordering: 17
        },
        "quotationDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: true,
            ordering: 18
        },

        "quotationDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },


        "quotationDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "quotationDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },


        "quotationDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },

        "quotationDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
    }), [customer, warehouse, symbol]);
}
