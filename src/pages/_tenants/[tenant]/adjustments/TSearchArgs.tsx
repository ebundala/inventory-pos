import { TSearchOptions } from "./create";

export type TSearchArgs<TState extends unknown = any, TQuery extends unknown = any, TLabel extends any = any> = Omit<TSearchOptions<TState, TQuery, TLabel>, "state">;
