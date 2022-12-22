import Loader from "@/components/sites/Loader";
import { ReactNode } from 'react';
export type CollectHooksReturnType<T extends unknown=unknown>={ data: T; isLoading: boolean; }
export function CollectRequiredDataWrapper({ useHooks, children }: {
    useHooks: () =>CollectHooksReturnType;
    children: ReactNode | {
        (props: any): ReactNode;
    };
}): JSX.Element {
    const { data, isLoading } = useHooks();
    if (isLoading)
        return <Loader />;
    return (
        <>
            {children instanceof Function ? children(data) : children}
        </>
    );
}
