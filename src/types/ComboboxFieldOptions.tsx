import { ComboBoxDataHook } from './ComboBoxDataHook';

export type ComboboxFieldOptions<TData = { [k: string]: any; }, TOptions = unknown> = {
  useGetDataHook: ComboBoxDataHook<TOptions, TData>;
  value?: TData;
  keyPath?: string | { (value: TData): string; };
  displayValuePath?: string | { (value: TData): string; };
  valuePath?: string | { (value: TData): string; };
  onChange?: (e: {target:{value:TData}}, reset?: () => void) => void;
  hideValue?: boolean;
};
