import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Customer, Warehouse } from '@prisma/client';
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { useWarehouseSearch } from "@/lib/hooks/useWarehouseSearch";



export function useSaleFormFieldOptions(opts?: { warehouse?: Warehouse; customer?: Customer; },isUpdate=false) {
    const { customer, warehouse } = opts ?? {};
    const currencyFormat = new Intl.NumberFormat();

    return useMemo((): ZodFormFieldOptions => ({
        date: {
            label: "Date",
            ordering: 1,
                 
        },
        warehouseId: {
            label: "Warehouse",
            ordering: 2,
            disabled: isUpdate,
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
                "Pending", "Ordered", "Completed"
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
            registerOptions:{
                value:0
            }
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
       
        "saleDetails.0.productId": {
            label: "Product",
            ordering: 13,
            hidden: true
        },
        "saleDetails.0.price": {
            label: "Unit Price",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 14,
            //hidden: true
        },
        "saleDetails.0.quantity": {
            label: "Quantity",
            ordering: 15,
            hideLabel: true,
        },
        "saleDetails.0.discount": {
            label: "Discount",
            ordering: 16,
            hideLabel: true,
            readonly: { format: currencyFormat.format },
        },
        "saleDetails.0.taxNet": {
            label: "Tax",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 17
        },
        "saleDetails.0.total": {
            label: "Subtotal",
            hideLabel: true,
            readonly: { format: currencyFormat.format },
            ordering: 18
        },
        "saleDetails.0.productVariantId": {
            label: "Product",
            ordering: 26,
            hidden: true
        },
        "saleDetails.0.imeiNumber": {
            label: "IMEI/Serial number",
            ordering: 30,
            hidden: true
        },
        "saleDetails.0.saleUnitId": {
            label: "sale unit",
            hidden: true,
            ordering: 31
        },
        "saleDetails.0.taxMethod": {
            label: "Tax method",
            hidden: true,
            ordering: 30
        },
        "saleDetails.0.discountMethod": {
            label: "Discount method",
            ordering: 27
        },
        "paymentSales.0.date": {
            hidden: true
        },
        "paymentSales.0.ref": {
            hidden: true
        },
        "paymentSales.0.id":{
            hidden:true
        },
        "paymentSales.0.userId":{
            hidden:true
        },
        "paymentSales.0.notes": {
            hidden: true
        },
        "paymentSales.0.amount": {
            label: "Received Amount",
            ordering: 11
        },
        "paymentSales.0.reglement": {
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
        "paymentSales.0.change": {
            label: "Change",
            readonly: { format: currencyFormat.format },
            ordering: 13,
        },
    }), [customer, warehouse,]);
}
