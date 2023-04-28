
import { FormContainer } from "@/components/FormContainer";
import { getLayout } from "@/layouts/getLayout";
import { CollectRequiredDataWrapper } from "@/components/CollectRequiredDataWrapper";
import { useAdjustmentRequiredData } from "@/lib/hooks/useAdjustmentRequiredData";
import { getProductFormatedName } from "@/lib/util/getProductFormatedName";
import { numberFormat } from "@/lib/util";

export function ViewAdjustment({
  adjustment,
  loading,
  refetch,
}: UpdateAdjustmentProps) {
  
const fmt = new Intl.DateTimeFormat();
  if ((!adjustment || !adjustment?.id) && !loading)
    return (
      <div className=" m-auto w-80 h-16 alert alert-error rounded-md text-center text-lg">
        <span className="m-auto">Invalid adjustment</span>
      </div>
    );

  return (
    <FormContainer title={<h2>Adjustment ref# {adjustment?.ref}</h2>}>
      <div className="flex flex-row pt-4">
        <table className="table xs:w-full w-1/3">
          <tbody>
            <tr>
              <td>Date</td>
              <td>{fmt.format(adjustment?.date)}</td>
            </tr>
            <tr>
              <td>Reference</td>
              <td>{adjustment?.ref}</td>
            </tr>
            <tr>
              <td>Warehouse</td>
              <td>{adjustment?.warehouse.name}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row pt-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Product</th>
              <th>Code</th>
              <th>Quantity</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {adjustment?.adjustmentDetails.map((v)=>(<tr key={v.id}>
              <td>{getProductFormatedName(v as any)}</td>
              <td>{v.product.code}</td>
              <td>{numberFormat()({value:v.quantity})}<span className="text-primary pl-2 text-sm">{v.product?.productUnit?.shortName}</span></td>
              <td>{v.type}</td>
            </tr>))}
          </tbody>
        </table>
      </div>
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