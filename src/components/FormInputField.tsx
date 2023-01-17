import { getPath, getValue, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { ReactNode } from "react";
import { Controller, useWatch } from "react-hook-form";
import { FormComboBox } from "./combobox";

export function FormInputField({ label, hideLabel, disabled, comboboxProps, name, control, required, readonly, props, options, error, type, upload, textArea, allowedValues: allowedvalues, ...rest }: ZodFormFieldConfig) {
  const hidden = props.hidden ? 'hidden' : '';
  let el: ReactNode

  if (comboboxProps) {
    return <FormComboBox
      control={control}
      label={label}
      name={name}
      required={required}
      error={error}
      hideLabel={hideLabel}

      props={{ ...props, type: 'search' }}
      {...comboboxProps}
    />
  }
  else if (props.type === 'checkbox') {
    el = (
      <label className={`cursor-pointer label ${hidden}`}>
        <span className={`label-text ${props.hidden ? 'hidden' : ''}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        <input {...props} className={`toggle toggle-primary ${hidden}`} />
      </label>)
  }
  else if (props.type === 'select' || options) {
    el = (
      <>
        {!hideLabel && <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </label>}
        <select {...props} className={`select select-bordered rounded-md ${props.hidden ? 'hidden' : ''}`}>
          {options?.map((v) => <option key={(v as any)?.value ?? v} value={(v as any)?.value ?? v}>{(v as any)?.label ?? v} </option>)}
        </select>
      </>
    )
  }
  else if (textArea) {
    el = (
      <>
        {!hideLabel && <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </label>}
        <textarea {...props} className={`textarea textarea-bordered rounded-md ${hidden}`} />
      </>
    )
  }
  else if (upload) {

    el = (
      <>
        {!hideLabel && <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </label>}
        <input {...props} type="file" className={`file-input file-input-bordered rounded-md ${hidden}`} />
      </>
    )
  }
  else if (readonly) {
    let format;
    if (readonly instanceof Object) {
      format = readonly.format;
    }
    return (<ReadonlyFormField
      required={required}
      format={format}
      hideLabel={hideLabel}
      name={name}
      error={error}
      label={label}
      control={control}
      props={props} />);
  }
  else if (props.type === 'date') {

    el = <Controller
      name={name}
      control={control}
      render={({ field }) => {
        //console.log((field.value as Date)?.toLocaleDateString() );
        // const { type,
        //   hidden,
        //   disabled,
        //   min,
        //   max, } = props;
         const   value= field.value instanceof Date?field.value.toISOString().substring(0,10):undefined//"2023-01-18";

        return (
          <>
            {!hideLabel && <label className={`label ${hidden}`}>
              <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
            </label>}
            <input
              {...{
                ...props,
                ...field,
                value,
                onChange: (e:any) => {
                  console.log(e.target.value)
                  field.onChange(e);
                }
              } as any} 
              
              className={`input input-bordered rounded-md ${hidden}`} />
          </>);
      }}
    />
  }
  else if (props.type === 'number') {

    el = (
      <>
        {!hideLabel && <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </label>}
        <input  {...props} className={`input input-bordered rounded-md ${hidden}`} />
      </>);
  }
  else {
    console.log("type", props.type);
    el = (
      <>
        {!hideLabel && <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </label>}
        <input {...props} className={`input input-bordered rounded-md ${hidden}`} />
      </>
    )
  }

  return (<div className={`form-control ${hidden}`} {...rest}>
    {el}
    {error &&
      <span className={`pt-2 text text-error text-xs font-semibold ${hidden ? 'hidden' : ''}`}>{error}</span>}

  </div>);
}



function ReadonlyFormField({ control, hideLabel, format, error, name, props, label, required, ...rest }: Pick<ZodFormFieldConfig, 'control' | 'required' | 'props' | 'name' | 'error' | 'label' | 'hideLabel'> & { format?: (v: any) => string }) {
  const hidden = props.hidden ? 'hidden' : '';

  const data = useWatch({ control });
  const value = getValue(getPath(name), data);

  return (<div className={`form-control ${hidden}`} {...rest}>
    {!hideLabel && <label className={`label ${hidden}`}>
      <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
    </label>}
    <span className="p-2">{format ? format(value) : value}</span>
    {error &&
      <span className={`pt-2 text text-error text-xs font-semibold ${hidden ? 'hidden' : ''}`}>{error}</span>}

  </div>);
}