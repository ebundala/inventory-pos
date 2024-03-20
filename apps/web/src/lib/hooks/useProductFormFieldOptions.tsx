import { ZodFormFieldOptions } from "@/lib/util/form-gen";
import { useMemo } from "react";
import { Brand, Category, Unit } from "@prisma/client";
import { useCategorySearch } from "./useCategorySearch";
import { useUnitSearch } from "./useUnitSearch";
import { useBrandSearch } from "./useBrandSearch";

export function useProductFormFieldOptions(opts?: {
  productUnit?: Unit;
  productsSaleUnit?: Unit;
  productPurchaseUnit?: Unit;
  brand?: Brand;
  category?: Category;
}) {
  return useMemo((): ZodFormFieldOptions => {
    const barcodeSymbologyLabels = [
      {
        label: "Code 128",
        value: "Code 128",
      },
      {
        label: "Code 39",
        value: "Code 39",
      },
      {
        label: "EAN8",
        value: "EAN8",
      },
      {
        label: "EAN13",
        value: "EAN13",
      },
      {
        label: "UPC",
        value: "UPC",
      },
    ];

    const taxMethods = [
      { label: "Inclusive", value: "inclusive" },
      { label: "Exclusive", value: "Exclusive" },
    ];
    return {
      name: {
        label: "Product name",
        ordering: 1,
        refine: (v) => {
          if (v) {
            return (v as string).length < 3 ? "product name too short" : null;
          }
        },
      },
      code: {
        label: "Product code",
        ordering: 2,
      },
      typeBarcode: {
        label: "Barcode symbology",
        ordering: 3,
        options: barcodeSymbologyLabels,
      },
      cost: {
        label: "Purchase price",
        ordering: 4,
        min: 0,
        refine: (value: any) => {
          return value < 0 ? "price cannot be negative" : null;
        },
      },
      price: {
        label: "Sale price",
        ordering: 5,
        min: 0,
        refine: (value: any) => {
          return value < 0 ? "price cannot be negative" : null;
        },
      },
      categoryId: {
        label: "Category",
        ordering: 6,
        combobox: {
          elevation: 40,
          value: opts?.category,
          valuePath: "id",
          useGetDataHook: useCategorySearch,
        },
      },
      brandId: {
        label: "Brand",
        ordering: 6,
        combobox: {
          elevation: 30,
          value: opts?.brand,
          valuePath: "id",
          useGetDataHook: useBrandSearch,
        },
      },
      unitId: {
        label: "Stock unit",
        ordering: 8,
        combobox: {
          elevation: 36,
          value: opts?.productUnit,
          valuePath: "id",
          useGetDataHook: useUnitSearch,
        },
      },
      unitSaleId: {
        label: "Sale unit",
        ordering: 7,
        combobox: {
          elevation: 10,
          value: opts?.productsSaleUnit,
          valuePath: "id",
          useGetDataHook: useUnitSearch,
        },
      },
      unitPurchaseId: {
        label: "Purchase unit",
        ordering: 6,
        combobox: {
          elevation: 20,
          value: opts?.productPurchaseUnit,
          valuePath: "id",
          useGetDataHook: useUnitSearch,
        },
      },
      taxNet: {
        label: "Tax (%)",
        ordering: 9,
        min: 0,
        refine: (value: any) => {
          return value < 0 ? "Tax cannot be negative" : null;
        },
      },
      taxMethod: {
        label: "Tax method",
        ordering: 9,
        options: taxMethods,
      },
      stockAlert: {
        label: "Stock alert",
        ordering: 10,
        min: 0,
        refine: (value: any) => {
          return value < 0 ? "stock cannot be negative" : null;
        },
      },
      note: {
        label: "Description",
        ordering: 11,
        textArea: true,
      },
      image: {
        label: "Product images",
        upload: { multiple: true, maxFiles: 5 },
        ordering: 12,
      },
      isVariant: {
        label: "Product has variants",
        ordering: 16,
      },
      isActive: {
        label: "In sale",
        ordering: 14,
      },
      isImei: {
        label: "Product has IMEI/Serial number",
        ordering: 15,
        // hidden: true
      },
      "productVariants.0.name": {
        label: "Variant name",
      },
      "productVariants.0.qty": {
        label: "Quantity",
        hidden: true,
        min: 0,
        registerOptions: {
          setValueAs: (v: any) => (v ? parseFloat(v) : 0),
        },
      },
      "productVariants.0.id": {
        label: "Variant id",
        hidden: true,
      },
      
      id: {
        hidden: true,
      },
    };
  }, [
    opts?.brand,
    opts?.category,
    opts?.productPurchaseUnit,
    opts?.productUnit,
    opts?.productsSaleUnit,
  ]);
}
