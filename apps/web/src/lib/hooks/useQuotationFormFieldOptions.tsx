import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Customer, Warehouse } from '@prisma/client';
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";

export function useQuotationFormFieldOptions(opts?: { warehouse?: Warehouse; customer?: Customer; }) {
    const { customer, warehouse } = opts ?? {};
    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            disabled:!!warehouse?.id,
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
            ordering: 4,
            min: 0
        },

        discount: {
            label: "Discount",
            ordering: 5,
            min: 0
        },
        shipping: {
            label: "Shipping",
            ordering: 6,
            min: 0
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
            min: 0
        },
        grandTotal: {
            label: "Grand total",
            hidden: true,
            ordering: 11,
            min: 0
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
            min: 1
        },
        "quotationDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: true,

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
    }), [customer, warehouse,]);
}
