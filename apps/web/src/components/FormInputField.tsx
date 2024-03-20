import { getPath, getValue, ZodFormFieldConfig } from "@/lib/util/form-gen";
import { ReactNode, useCallback } from "react";
import { Controller, useWatch } from "react-hook-form";
import { FormComboBox } from "./combobox";
import Image from "next/image";
import CloudinaryUploadWidget from "./Cloudinary";
import { BsTrash } from "react-icons/bs";
import { tryJsonParse } from "../core/util/tryJsonParse";
import { CloudinaryCallbackImage } from "@/types";

export function FormInputField({
  label,
  hideLabel,
  disabled,
  comboboxProps,
  name,
  control,
  required,
  readonly,
  props,
  options,
  error,
  type,
  upload,
  textArea,
  allowedValues: allowedvalues,
  ...rest
}: ZodFormFieldConfig) {
  const hidden = props.hidden ? "hidden" : "";
  let el: ReactNode;

  if (comboboxProps) {
    return (
      <FormComboBox
        control={control}
        label={label}
        name={name}
        required={required}
        error={error}
        hideLabel={hideLabel}
        props={{ ...props, type: "text" }}
        {...comboboxProps}
      />
    );
  } else if (props.type === "checkbox") {
    el = (
      <label className={`cursor-pointer label ${hidden}`}>
        <span className={`label-text ${props.hidden ? "hidden" : ""}`}>{`${
          label ?? name
        }${required && (label ?? name) ? "*" : ""}`}</span>
        <input {...props} className={`toggle toggle-primary ${hidden}`} />
      </label>
    );
  } else if (props.type === "select" || options) {
    el = (
      <>
        {!hideLabel && (
          <label className={`label ${hidden}`}>
            <span className={`label-text ${hidden}`}>{`${label ?? name}${
              required && (label ?? name) ? "*" : ""
            }`}</span>
          </label>
        )}
        <select
          {...props}
          className={`select select-bordered rounded-md ${
            hidden ? "hidden" : ""
          }`}
        >
          {options?.map((v) => (
            <option key={(v as any)?.value ?? v} value={(v as any)?.value ?? v}>
              {(v as any)?.label ?? v}{" "}
            </option>
          ))}
        </select>
      </>
    );
  } else if (textArea) {
    el = (
      <>
        {!hideLabel && (
          <label className={`label ${hidden}`}>
            <span className={`label-text ${hidden}`}>{`${label ?? name}${
              required && (label ?? name) ? "*" : ""
            }`}</span>
          </label>
        )}
        <textarea
          {...props}
          className={`textarea textarea-bordered rounded-md ${hidden}`}
        />
      </>
    );
  } else if (upload) {
    const isMultiple: boolean =
      typeof upload === "boolean" ? false : upload.multiple;
    const maxFiles = typeof upload === "boolean" ? 1 : upload.maxFiles;

    el = (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <>
              {!hideLabel && (
                <label className={`label ${hidden}`}>
                  <span className={`label-text ${hidden}`}>{`${label ?? name}${
                    required && (label ?? name) ? "*" : ""
                  }`}</span>
                </label>
              )}
              {/* <input {...{...props,...field}} 
              hidden
              /> */}

              <UploadWidget
                value={field.value}
                isMultiple={isMultiple}
                maxFiles={maxFiles}
                hidden={hidden}
                onChange={(value) => {
                  console.log("files", value);
                  
                  field.onChange({ target: { value } });
                }}
              />
            </>
          );
        }}
      />
    );
  } else if (readonly) {
    let format;
    if (readonly instanceof Object) {
      format = readonly.format;
    }
    return (
      <ReadonlyFormField
        required={required}
        format={format}
        hideLabel={hideLabel}
        name={name}
        error={error}
        label={label}
        control={control}
        props={props}
      />
    );
  } else if (props.type === "date") {
    el = (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          //console.log((field.value as Date)?.toLocaleDateString() );
          // const { type,
          //   hidden,
          //   disabled,
          //   min,
          //   max, } = props;
          
          let value = undefined;
         try{
         value = field.value.toISOString().substring(0, 10)
              
         } catch(e){
         value=undefined
         }
          return (
            <>
              {!hideLabel && (
                <label className={`label ${hidden}`}>
                  <span className={`label-text ${hidden}`}>{`${label ?? name}${
                    required && (label ?? name) ? "*" : ""
                  }`}</span>
                </label>
              )}
              <input
                {...({
                  ...props,
                  ...field,
                  value,
                  onChange: (e: any) => {
                    //console.log(e.target.value)
                    field.onChange({
                      target: { value: new Date(e.target.value) },
                    });
                  },
                } as any)}
                className={`input input-bordered rounded-md ${hidden}`}
              />
            </>
          );
        }}
      />
    );
  } else if (props.type === "number") {
    el = (
      <>
        {!hideLabel && (
          <label className={`label ${hidden}`}>
            <span className={`label-text ${hidden}`}>{`${label ?? name}${
              required && (label ?? name) ? "*" : ""
            }`}</span>
          </label>
        )}
        <input
          {...props}
          className={`input input-bordered rounded-md ${hidden}`}
        />
      </>
    );
  } else {
    el = (
      <>
        {!hideLabel && (
          <label className={`label ${hidden}`}>
            <span className={`label-text ${hidden}`}>{`${label ?? name}${
              required && (label ?? name) ? "*" : ""
            }`}</span>
          </label>
        )}
        <input
          {...props}
          className={`input input-bordered rounded-md ${hidden}`}
        />
      </>
    );
  }

  return (
    <div className={`form-control ${hidden}`} {...rest}>
      {el}
      {error && (
        <span
          className={`pt-2 text text-error text-xs font-semibold ${
            hidden ? "hidden" : ""
          }`}
        >
          {error}
        </span>
      )}
    </div>
  );
}
type UploadWidgetProps = {
  isMultiple: boolean;
  maxFiles: number;
  hidden: string;
  value?: string;
  onChange: (e: string) => void;
};
function UploadWidget({
  isMultiple,
  maxFiles,
  hidden,
  value,
  onChange,
}: UploadWidgetProps) {

   const callback = useCallback((image: CloudinaryCallbackImage) => {
      
    if (isMultiple) {
      const v = tryJsonParse<string[]>(value, "[]");
      const str =JSON.stringify([...v, image.secure_url]);
      onChange(str);
    } else {
      onChange(JSON.stringify([image.secure_url]));
    }
  },[isMultiple,onChange,value]);
  
  
  return (
    <CloudinaryUploadWidget
      multiple={isMultiple}
      maxFiles={maxFiles}
      callback={callback}
    >
      {({ open }) => {
        const files: string[] = tryJsonParse<string[]>(value, "[]")
          

        let content: ReactNode = (
          <div className="w-full h-fit shadow-md p-2 flex-1 grid grid-flow-row grid-cols-3 gap-2">
            {files.filter(Boolean).map((v) => (
              <div key={v} className="relative w-[80px] h-[80px]">
                <BsTrash
                  size={28}
                  className="absolute right-1 top-1 z-10 text-primary"
                  onClick={() => {
                    const filtered = files.filter((e) => e !== v);
                    onChange(JSON.stringify(filtered));
                  }}
                />
                <Image
                  className="rounded-md border-2 border-gray-400 p-2"
                  src={v}
                  width={80}
                  height={80}
                  alt="product img"
                />
              </div>
            ))}
          </div>
        );

        return (
          <div className="flex flex-col space-y-2">
            {files.length > 0 && content}

            <div
              onClick={(e) => {
               // e.preventDefault();
                if (
                  (isMultiple && files.length < maxFiles) ||
                  files.length === 0
                ) {
                  open(e);
                }
                if(!isMultiple){
                  open(e);
                }
              }}
              className={`file-input file-input-bordered rounded-md ${hidden} flex flex-row items-center space-x-2 cursor-pointer`}
            >
              <div className="bg-gray-700  h-full text-white flex flex-col justify-center items-center">
                <span className="p-2">Choose file</span>
              </div>
              <div className="bg-white  text-base ">
                {!isMultiple
                  ? files.length > 0
                    ? files.at(0)?.slice(-8)
                    : "no selected file"
                  : `${files.length ?? 0}/${maxFiles} selected files`}
              </div>
            </div>
          </div>
        );
      }}
    </CloudinaryUploadWidget>
  );
}
function ReadonlyFormField({
  control,
  hideLabel,
  format,
  error,
  name,
  props,
  label,
  required,
  ...rest
}: Pick<
  ZodFormFieldConfig,
  "control" | "required" | "props" | "name" | "error" | "label" | "hideLabel"
> & { format?: (v: any) => string }) {
  const hidden = props.hidden ? "hidden" : "";

  const data = useWatch({ control });
  const value = getValue(getPath(name), data);

  return (
    <div className={`form-control ${hidden}`} {...rest}>
      {!hideLabel && (
        <label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${
            required && (label ?? name) ? "*" : ""
          }`}</span>
        </label>
      )}
      <span className="p-2">{format ? format(value) : value}</span>
      {error && (
        <span
          className={`pt-2 text text-error text-xs font-semibold ${
            hidden ? "hidden" : ""
          }`}
        >
          {error}
        </span>
      )}
    </div>
  );
}
