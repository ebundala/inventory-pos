/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
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
import {
  AdjustmentDetail,
  Prisma,
  Product,
  ProductVariant,
  ProductWarehouse,
} from "@prisma/client";
import { CustomTable } from "@/components/table";
import { FormComboBox } from "@/components/combobox";
import { useProductSearch } from "@/lib/hooks/useProductSearch";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { useRenderFieldArrayForm } from "@/lib/hooks/useRenderFieldArrayForm";
import { useGetZodFormField } from "@/lib/hooks/useGetZodFormField";
import { useAdjustmentRequiredData } from "@/lib/hooks/useAdjustmentRequiredData";
import { useProgressFeedback } from "@/lib/hooks/useProgressFeedback";
import { useEnforceUniqueProduct } from "@/lib/hooks/useEnforceUniqueProduct";
import { calculateStock } from "@/lib/util/calculateStock";
import { TStockDataInput } from "@/types/TStockDataInput";
import { useSetComputedValues } from "@/lib/hooks/useSetComputedValues";
import { useAdjustmentStockConstraints } from "@/lib/hooks/useAdjustmentStockConstraints";

export function ViewAdjustment({
  adjustment,
  loading,
  refetch,
}: UpdateAdjustmentProps) {
  

  if ((!adjustment || !adjustment?.id) && !loading)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid adjustment</span>
      </div>
    );

  return (
    <FormContainer title={<h2>Adjustment ref# {adjustment?.ref}</h2>}>
      
    </FormContainer>
  );
}

export default function Index() {
  return (
    <CollectRequiredDataWrapper useHooks={useAdjustmentRequiredData}>
      {(props) => {
        return <ViewAdjustment {...props} />;
      }}
    </CollectRequiredDataWrapper>
  );
}

Index.getLayout = getLayout;

type UpdateAdjustmentProps = ReturnType<
  typeof useAdjustmentRequiredData
>["data"];
