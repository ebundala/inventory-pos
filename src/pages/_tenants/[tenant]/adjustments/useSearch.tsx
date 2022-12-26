import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
export type TSearchOptions<TState, TQuery, TLabel, TDefaultQuery extends TQuery = TQuery> = {
    state: TState,
    format: (data: TState) => TLabel
    queryBuilder: (query: string) => TQuery,
    defaultQuery: TDefaultQuery
    debounce: number
}

export function useSearch<TQuery extends unknown=any, TFormat extends unknown=any, TResult extends unknown=any>({ state, format, queryBuilder, defaultQuery, debounce = 250 }: TSearchOptions<TResult, TQuery, TFormat>) {
    const [text, setSearchText] = useState("");
    const [query, setQuery] = useState<TQuery>(defaultQuery);

    const labels = useMemo(() => {
        return format ? format(state) : undefined;
    }, [state]);

    const [dText] = useDebounce(text, 1000);

    useEffect(() => {
        console.log("query should excute now");
        setQuery(queryBuilder(dText));
    }, [dText]);

    return { labels, setSearchText, state, text, query };
}
