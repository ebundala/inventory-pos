import { getPath, getValue, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { ReactNode, useEffect, useRef } from "react";
import { ArrayPath, Control, DeepPartial, FieldArray, FieldError, FieldErrorsImpl, FieldValue, FieldValues, FormState, Path, PathValue, UseFormRegisterReturn, useWatch, Validate, ValidationRule } from "react-hook-form";

export function FormInputField({ label,hideLabel, name,control, required,readonly, props, options, error, type, upload, textArea, allowedValues: allowedvalues, ...rest }: ZodFormFieldConfig) {
  const hidden = props.hidden ? 'hidden' : '';
  let el: ReactNode
  if (props.type === 'checkbox') {
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
  else if (textArea){
    el=(
      <>
{!hideLabel &&<label className={`label ${hidden}`}>
    <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
    </label>}
        <textarea {...props} className={`textarea textarea-bordered rounded-md ${hidden}`} />
    </>
    )
  }
  else if(upload){
    
    el=(
      <>
{!hideLabel &&<label className={`label ${hidden}`}>
    <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
    </label>}
        <input {...props} type="file" className={`file-input file-input-bordered rounded-md ${hidden}`} />
    </>
    )
  }
  else if(readonly){
    return (<ReadonlyFormField 
      required={required}
      hideLabel={hideLabel}
       name={name}
        error={error} 
        label={label} 
      control={ control} 
      props={props} />);
  }
  else{
    el=(
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



function ReadonlyFormField({control,hideLabel,error,name, props,label, required,...rest}:Pick<ZodFormFieldConfig, 'control'|'required' | 'props' | 'name' | 'error'| 'label' | 'hideLabel'>){
  const hidden = props.hidden ? 'hidden' : '';

  const data = useWatch({control});
  const value = getValue(getPath(name),data);

  return (<div className={`form-control ${hidden}`} {...rest}>
   {!hideLabel &&<label className={`label ${hidden}`}>
    <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
    </label>}
    {value}
  {error &&
    <span className={`pt-2 text text-error text-xs font-semibold ${hidden ? 'hidden' : ''}`}>{error}</span>}

</div>);
}