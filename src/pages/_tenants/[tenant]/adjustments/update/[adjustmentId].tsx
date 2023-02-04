import { FormContainer } from "@/components/FormContainer";
import { FormInputField } from "@/components/FormInputField";
import { updateAdjustmentInputSchema } from "@/core/adjustment/index.zod";
import { getLayout } from "@/layouts/getLayout";
import { useZodForm } from "@/lib/util/form-gen";
import { ParsedUrlQuery } from "querystring";
import { useAdjustmentFormFieldOptions } from "@/lib/hooks/useAdjustmentFormFieldOptions";
import { useEffect, useMemo } from "react";
import { useFieldArrayName } from "@/lib/hooks/useFieldArrayName";
import { useSplitFormConfigToFieldArray } from "@/lib/hooks/useSplitFormConfigToFieldArray";
import { useFieldArray, FieldValues, FieldArrayPath } from "react-hook-form";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { AdjustmentDetail, Prisma, Product, ProductVariant, ProductWarehouse } from "@prisma/client";
import { CustomTable } from "@/components/table";
import { FormComboBox } from "@/components/combobox";
import { useProductSearch } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useAdjustmentRequiredData } from "@/lib/hooks/useAdjustmentRequiredData";

export function UpdateAdjustment({
  defaultWarehouse,
  adjustment,
  loading,
  refetch,
}: UpdateAdjustmentProps) {
  const options = useAdjustmentFormFieldOptions(adjustment as any);

  const [config, form] = useZodForm(updateAdjustmentInputSchema, options, {
    defaultValues: { ...adjustment },
  });

  const [regularConfig, fieldArrayConfig] =
    useSplitFormConfigToFieldArray(config);
  const fname = useFieldArrayName(fieldArrayConfig);

  const adjustmentDetailsForm = useFieldArray<
    FieldValues,
    FieldArrayPath<FieldValues>,
    "key"
  >({ control: form.control, name: fname });

  const trpcWithHost = useTrpcTenant();
  const result = trpcWithHost.adjustment.update.useMutation({
    onSuccess: (data, variables, context) => {
      console.log(data, variables);
      //form.reset();
      refetch();
    },
  });

  useMemo(() => {
    console.log("adjustment details changed");
    form.setValue(
      Prisma.AdjustmentScalarFieldEnum.items,
      adjustmentDetailsForm.fields.length
    );
  }, [adjustmentDetailsForm.fields.length]);

  useEffect(() => {
    const adjustmentDetails = adjustment?.adjustmentDetails?.map((v) => {
      const productVariantId = v.productVariantId ? v.productVariantId : -1;
      return { ...v, productVariantId };
    });
    form.reset({ ...adjustment, adjustmentDetails });
  }, [adjustment]);

  const detailsData = useRenderFieldArrayForm(
    fname,
    adjustmentDetailsForm,
    form,
    fieldArrayConfig
  );

  const [notesField, otherFields] = useGetZodFormField(
    Prisma.AdjustmentScalarFieldEnum.notes,
    regularConfig
  );
  const warehouseId = form.watch(Prisma.AdjustmentScalarFieldEnum.warehouseId);

  if ((!adjustment || !adjustment?.id) && !loading)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid adjustment</span>
      </div>
    );

  return (
    <FormContainer title={<h2>Update Adjustment</h2>}>
      <form
        onSubmit={form.handleSubmit(
          async (data) => {
            //submit here
            console.log(data);
            await result.mutateAsync(data as any);
          },
          (e) => {
            console.error(e);
          }
        )}
      >
        <div className="grid grid-flow-row xs:grid-cols-1  sm:grid-cols-2 gap-3">
          {otherFields.map((i) => {
            return <FormInputField key={i.name} {...i} />;
          })}
        </div>
        <div className="w-full">
          <FormComboBox
            label="Products"
            name="Product search"
            hideValue={true}
            control={form.control}
            keyPath={(v) => getProductFormatedName(v as any)}
            displayValuePath={(v) => getProductFormatedName(v as any)}
            onChange={(e, reset) => {
              const v = e.target.value;
              //console.log(v)
              adjustmentDetailsForm.append({ id: -1, ...v });
              if (reset) {
                reset();
              }
            }}
            useGetDataHook={() => {
              const { labels, data, ...rest } = useProductSearch();
              return { data: labels, ...rest };
            }}
          />
        </div>

        <div className="w-full  ">
          <CustomTable
            colDeps={[warehouseId]}
            rowsData={detailsData}
            collumsData={() => [
              {
                Header: "Product code",
                accessor: "product.code",
                disableSortBy: true,
              },
              {
                Header: "Product",
                accessor: "productId",
                disableSortBy: true,

                Cell: ({ row }: { row: any }) => {
                  return (
                    <div className="w-[160px] whitespace-normal text-ellipsis break-words">
                        {getProductFormatedName(row.original)}
                    </div>);
                },
              },
              {
                Header: "Stock",
                accessor: "product.productWarehouse",
                disableSortBy: true,
                Cell: ({
                  row,
                  value,
                }: {
                  value: ProductWarehouse[];
                  row: any;
                }) => {
                  const detail = row.original as AdjustmentDetail & {
                    product: Product;
                    productVariant?: ProductVariant;
                  };

                  if (detail.product?.isVariant === true) {                    
                    return value
                      ?.filter(
                        (v) =>
                          v.warehouseId === warehouseId &&
                          v.productVariantId === detail.productVariantId
                      )
                      ?.reduce((p, c) => p + c.qty, 0);
                  }
                  return value
                    ?.filter((v) => v.warehouseId === warehouseId)
                    ?.reduce((p, c) => p + c.qty, 0);
                },
              },
              {
                Header: "Quantity",
                accessor: "fields.3",
                disableSortBy: true,
              },
              {
                Header: "Type",
                accessor: "fields.4",
                disableSortBy: true,
              },
              {
                Header: "",
                accessor: "fields.0",
                disableSortBy: true,
              },
              {
                Header: "",
                accessor: "fields.1",
                disableSortBy: true,
              },
              {
                Header: "",
                accessor: "action",
                disableSortBy: true,
                Cell: ({ row }: { row: any }) => {
                  return (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        adjustmentDetailsForm.remove(row.index);
                      }}
                      className="btn btn-warning btn-outline btn-xs"
                    >
                      remove
                    </button>
                  );
                },
              },
            ]}
            search={false}
            pagenation={false}
          />
        </div>
        <div className="w-full">
          <FormInputField {...(notesField as any)} />
        </div>
        <div className="flex flex-row py-3 justify-start">
          <button type="submit" className=" btn btn-primary rounded-md  ">
            Submit{" "}
          </button>
        </div>
      </form>
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useAdjustmentRequiredData}>
      {(props) => {
        return <UpdateAdjustment {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

type UpdateAdjustmentProps = ReturnType<
  typeof useAdjustmentRequiredData
>["data"];
