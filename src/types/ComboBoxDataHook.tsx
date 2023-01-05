export type ComboBoxDataHook<TOptions, TData> = (opts?: TOptions) => [TData[], (text: string) => void, boolean,string];
