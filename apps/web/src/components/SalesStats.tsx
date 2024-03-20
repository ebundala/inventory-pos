import { BsGraphUp } from "react-icons/bs";
import { useTrpcTenant } from "@/lib/hooks/useTrpcTenant";

export function SalesStats({
  startDate, endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const trpcTenant = useTrpcTenant();
  const result = trpcTenant.report.sales.useQuery({
    where:{
      AND:[{
      date:{
        gte:startDate

      }},
      {
        date:{
          lte:endDate

        }}]}
    
  });
  const formater = new Intl.NumberFormat(undefined, {
    compactDisplay: "short",
  });
  const desc = startDate.toLocaleDateString() === endDate.toLocaleDateString()
    ? startDate.toLocaleDateString()
    : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  return (
    <div className=" stats shadow-md">
      <div className="stat">
        <div className="stat-figure text-primary">
          <BsGraphUp size={48} />
        </div>
        <div className="stat-title">Sales</div>
        <div className="stat-value text-xl  text-primary">
          {result.isSuccess
            ? formater.format(
              result.data.reduce((p, c) => p + (c?._sum.grandTotal ?? 0), 0)
            )
            : ""}
        </div>
        <div className="stat-desc">{desc}</div>
      </div>
    </div>
  );
}
