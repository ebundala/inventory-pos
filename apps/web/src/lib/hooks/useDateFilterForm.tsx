import { useZodForm } from "@/lib/util/form-gen";
import { z } from "zod";
const schema = z.object({
  startAt: z.date(),
  endAt: z.date(),
}).refine((data) => data.startAt < data.endAt, {
  path: ["endAt"],
  message: "Start date must be prior to end date"
})
export type DateFilterArg = z.infer<typeof schema>
export function useDateFilterForm() {
  return useZodForm(schema,{
    startAt: {
      label: "Start date",
      ordering: 1
    },
    endAt: {
      label: "End date"
    }});
}
