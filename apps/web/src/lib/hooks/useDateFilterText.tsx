import { dateFormat } from "@/lib/util";
import { useForm } from "react-hook-form";

export function useDateFilterText(form: ReturnType<typeof useForm>) {
  const values = form.getValues();
  if (values.startAt < values.endAt) {
    return `${dateFormat()({ value: values.startAt })} ${values.endAt ? "-" : ""} ${dateFormat()({ value: values.endAt })}`;
  }
  return "";
}
