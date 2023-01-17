import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { ZodFormFieldConfig, ZodFormRegisterCallbacksTypes } from "@/lib/util/form-gen";
import { ComboboxFieldOptions } from '@/types/ComboboxFieldOptions';
import { Control, FieldValues, useController } from 'react-hook-form';

type ComboBoxProps<TData = { [k: string]: any }, TOptions = any> = ComboboxFieldOptions<TData, TOptions>
  & Partial<Omit<ZodFormFieldConfig, "ordering" |
    "control" |
    "readonly" |
    "literalValue" | 'allowedValues' |
    "options" |
    "upload" |
    "textArea" | "type">> & { props?: Partial<ZodFormRegisterCallbacksTypes>, control: Control<FieldValues, unknown> };

export function FormComboBox({ useGetDataHook, value, defaultOption, elevation = 20, onChange, valuePath, displayValuePath = 'name', keyPath = "id", hideValue, name, required, label, error, control, props, hideLabel }: ComboBoxProps) {
  const hidden = props?.hidden ? 'hidden' : '';
  const disabled = props?.disabled;
  const { onBlur, onChange: formOnChange, ref, name: formFieldName, ...inputProps } = props ?? {};
  const controller = useController({ name: formFieldName ?? "", control: control })

  const [selected, setSelected] = useState(value)
  const reset = () => setSelected(undefined);
  const {data:items, setSearchText, loading, text} = useGetDataHook();
  
  const displayValueFn = (item: typeof items[0]) => {
    if (displayValuePath instanceof Function) {
      return item ? displayValuePath(item) : "";
    } else {
      return item ? (item as any)[displayValuePath] : "";
    }
  }
  const getKeyFn = (item: typeof items[0]) => {
    if (keyPath instanceof Function) {
      return keyPath(item);
    }
    else {
      return item ? (item as any)[keyPath] : "";

    }
  }
  const getValueFn = (item: typeof items[0]): any => {
    if (valuePath instanceof Function) {
      return valuePath(item)
    }
    else if (valuePath?.length) {
      return item ? (item as any)[valuePath] : "";

    } else {
      return item;
    }
  }
  useEffect(() => {
    if (selected) {
      const value = getValueFn(selected)
      controller.field.onChange(value)
    }
  }, [])


  return (
    <Combobox
      value={selected}
      disabled={disabled}
      onChange={(v) => {
        setSelected(v)
        if (onChange) {
          onChange({ target: { value: getValueFn(v) } }, reset);
        }
        if (formOnChange) {
          const value = getValueFn(v)

          console.log(value)
          //formOnChange({ target: { value},type:"change"});
          controller.field.onChange(value)

        }


      }} >
      <div className={`relative form-control z-${elevation} ${hidden}`}>
        {!hideLabel && <Combobox.Label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </Combobox.Label>}

        <Combobox.Input

          className='input input-bordered'
          {...props}
          displayValue={(item) => hideValue ? "" : displayValueFn(item as any)}
          onChange={(e) => {
            // console.log(e.type)
            //  const value = getValueFn(selected ??{});
            // if(formOnChange){
            //   formOnChange({ target: {...e.target, value}, type: e.type});
            // }
            setSearchText(e.target.value)
          }
          }
          onBlur={(e: any) => {
            const value = getValueFn(selected ?? {});
            if (onBlur) {
              // onBlur({ target: {...e.target, value}, type: e.type});
              controller.field.onChange(value)
            }
          }}
          {...inputProps}
        />
         <Combobox.Button className="absolute inset-y-0 right-0 flex flex-col justify-end pr-2 pb-2">
           {/* <div className='flex flex-col items-center '>  */}
            <FaChevronUp
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              <FaChevronDown
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
              {/* </div>  */}
            </Combobox.Button> 
        {/* </div> */}
        {error &&
          <span className={`pt-2 text text-error text-xs font-semibold ${hidden ? 'hidden' : ''}`}>{error}</span>}

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSearchText('')}
        >
          <Combobox.Options className="absolute top-20 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {items.length === 0 && !loading ? (
              defaultOption ? defaultOption : (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              )) :
              (

                items.map((item) => (
                  <Combobox.Option
                    key={getKeyFn(item)}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary text-white' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {displayValueFn(item)}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                              }`}
                          >
                            <FaCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  )
}

// export default function Index() {
//   return (
//     <div className='h-screen flex flex-col justify-center'>
//       <FormComboBox
//         label="ComboBox"
//         name="Product search"
//         required={true}
//         error={"error text"}
//         keyPath={(data) => {
//           const key = `${data.name}-${data.variantName}`;
//           console.log("key",key)
//           return key;
//         }}
//         displayValuePath='name'
//         useGetDataHook={() => {
//           const [_, result, labels, setSearchText] = useProductSearch()
//           return [labels, setSearchText, result.isLoading]
//         }}

//       />
//     </div>
//   )
// }
// Index.getLayout = getLayout