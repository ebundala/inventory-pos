export type ComboBoxDataHook<TOptions, TData> = (opts?: TOptions) => {data:TData[], setSearchText:(text: string) => void, loading:boolean,text:string};
