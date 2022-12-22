import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Brand, Category, Unit } from "@prisma/client";

export function useProductFormFieldOptions(units: Unit[] | null, brands: Brand[] | null, categories: Category[] | null) {
    return useMemo((): ZodFormFieldOptions => {
        const unitsWithlabels = units?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const brandsWithlabels = brands?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const categoriesWithLabels = categories?.map((c) => ({ label: c.name, value: c.id })) ?? [];
        const barcodeSymbologyLabels = [{
            label: "Code 128",
            value: "Code 128"
        }, {
            label: "Code 39",
            value: "Code 39"
        }, {
            label: "EAN8",
            value: "EAN8"
        }, {
            label: "EAN13",
            value: "EAN13"
        }, {
            label: "UPC",
            value: "UPC"
        }];
        const taxMethods = [{ label: "Inclusive", value: "inclusive" }, { label: "Exclusive", value: "Exclusive" }];
        return {
            name: {
                label: "Product name",
                ordering: 1
            },
            code: {
                label: "Product code",
                ordering: 2
            },
            typeBarcode: {
                label: "Barcode symbology",
                ordering: 3,
                options: barcodeSymbologyLabels
            },
            cost: {
                label: "Purchase price",
                ordering: 4
            },
            price: {
                label: "Sale price",
                ordering: 5
            },
            categoryId: {
                label: "Category",
                ordering: 6,
                options: categoriesWithLabels
            },
            brandId: {
                label: "Brand",
                ordering: 6,
                options: brandsWithlabels
            },
            unitId: {
                label: "Stock unit",
                ordering: 7,
                options: unitsWithlabels
            },
            unitSaleId: {
                label: "Sale unit",
                ordering: 6,
                options: unitsWithlabels
            },
            unitPurchaseId: {
                label: "Purchase unit",
                ordering: 6,
                options: unitsWithlabels
            },
            taxNet: {
                label: "Order Tax (%)",
                ordering: 7
            },
            taxMethod: {
                label: "Tax method",
                ordering: 8,
                options: taxMethods
            },
            stockAlert: {
                label: "Stock alert",
                ordering: 9
            },
            note: {
                label: "Description",
                ordering: 10,
                textArea: true
            },
            image: {
                label: "Product images",
                // upload:true,
                ordering: 11
            },
            isVariant: {
                label: "Product has variants",
                ordering: 12
            },
            isActive: {
                label: "In sale",
            },
            isImei: {
                label: "Product has IMEI",
                hidden: true
            },
            "productVariants.0.name": {
                label: "Variant name",
            },
            "productVariants.0.qty": {
                label: "Quantity",
                hidden: true
            },
            "productVariants.0.id": {
                label: "Variant id",
                hidden: true
            },
            tenantId: {
                hidden: true
            },
            id:{
                hidden:true
            }
        };
    }, [units, categories, brands]);
}
