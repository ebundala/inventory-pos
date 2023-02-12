import { FormInputField } from "@/components/FormInputField";
import { getValue, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { ZodFirstPartyTypeKind } from "zod";

export function renderFieldArrayForm({ config, key, index, errors, register, name }: { config: ZodFormFieldConfig[]; key: string; errors: any; index: number; register: (name: string, opts: any) => any; name: string; }) {
    return config.map((v, i) => {
        const fieldName = v.name.split(".").slice(-1)[0];
        const error = getValue([name, index, fieldName], errors ?? {})?.message?.toString();
        const valueAsDate = v.type == ZodFirstPartyTypeKind.ZodDate;
        const valueAsNumber = v.type == ZodFirstPartyTypeKind.ZodNumber;
        const name1 = `${name}.${index}.${fieldName}`;
        const props = { ...v,name:name1, error, key: `${key}_${index}_${i}`, props: { ...v.props, ...register(name1, { valueAsDate, valueAsNumber }) } };
        // eslint-disable-next-line react/jsx-key
        return (<FormInputField {...props} />);
    });
}
