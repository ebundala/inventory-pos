import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { FaCheck } from 'react-icons/fa'
import { getLayout } from '@/layouts/getLayout'
import { useProductSearch } from "./useProductSearch"
import { ZodFormFieldConfig, ZodFormRegisterCallbacksTypes } from "@/lib/util/form-gen";
type ComboBoxDataHook<TOptions, TData,> = (opts?: TOptions) => [TData[], (text: string) => void, boolean]

type ComboBoxProps<TData = { [k: string]: any }, TLabel = { [k: string]: any }, TOptions = unknown> = {
  useGetDataHook: ComboBoxDataHook<TOptions, TData>
  value?: TData,
  keyPath?: string | { (value: TData): string },
  displayValuePath?: string | { (value: TData): string },
  valuePath?: string | { (value: TData): string },
  onChange?: (value: TData, reset?: () => void) => void,
  displayName?:boolean
} & Omit<ZodFormFieldConfig, "ordering" |
  "options" |
  "upload" |
  "textArea" | "type"> & { props?: Partial<ZodFormRegisterCallbacksTypes> };

export function FormComboBox({ useGetDataHook, value, onChange, valuePath, displayValuePath = 'name', keyPath = "id",displayName=true, name, required, label, error, props }: ComboBoxProps) {
  const [selected, setSelected] = useState(value)
  const reset = () => setSelected(undefined);
  const [items, setSearchText, isLoading] = useGetDataHook();
  const displayValue = (item: typeof items[0]) => {
    if (displayValuePath instanceof Function) {
      return item ? displayValuePath(item): "";
    } else {
      return item ? (item as any)[displayValuePath] : "";
    }
  }
  const getKey = (item: typeof items[0]) => {
    if (keyPath instanceof Function) {
      return keyPath(item)
    }
    else {
      return item ? (item as any)[keyPath] : "";

    }
  }
  const getValue = (item: typeof items[0]): any => {
    if (valuePath instanceof Function) {
      return getValue(item)
    }
    else if (valuePath?.length) {
      return item ? (item as any)[valuePath] : "";

    } else {
      return item;
    }
  }
  const hidden = props?.hidden ? 'hidden' : '';
  const { onBlur, onChange: formOnChange, ref, name: formFieldName, ...inputProps } = props ?? {};
  return (

    <Combobox value={selected} onChange={(v) => {
      setSelected(v)
      if (onChange) {
        onChange({ target: { value: getValue(v) } }, reset);
      }else  if (formOnChange) {
        formOnChange({ target: { value: getValue(v) } });
      }
      

    }} >
      <div className={`relative form-control z-20 ${hidden}`}>
        <Combobox.Label className={`label ${hidden}`}>
          <span className={`label-text ${hidden}`}>{`${label ?? name}${required && (label ?? name) ? '*' : ''}`}</span>
        </Combobox.Label>
        {/* <div className="relative mt-1  p-0 pt-1 "> */}
        {/* <div className=" relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"> */}
        {/*               classNames="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 "
 */}
        {/* <div className='input input-bordered'> */}
        <Combobox.Input

          className='input input-bordered'
          {...props}
          displayValue={(item) => displayName?"":displayValue(item as any)}
          onChange={(event) => setSearchText(event.target.value)}
          
          {...inputProps}
        />
        {/* <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <div className='flex flex-col items-center justify-between'>
            <FaChevronUp
                className="h-2 w-2 text-gray-400"
                aria-hidden="true"
              />
              <FaChevronDown
                className="h-2 w-2 text-gray-400"
                aria-hidden="true"
              />
              </div>
            </Combobox.Button> */}
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
            {items.length === 0 && !isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (

              items.map((item) => (
                <Combobox.Option
                  key={getKey(item)}
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
                        {displayValue(item)}
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