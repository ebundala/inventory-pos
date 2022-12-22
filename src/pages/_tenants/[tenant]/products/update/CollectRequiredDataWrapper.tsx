import Loader from "@/components/sites/Loader";
import { ReactNode } from 'react';

export function CollectRequiredDataWrapper({ useHooks, children }: {
    useHooks: () => { data: any; isLoading: boolean; };
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
