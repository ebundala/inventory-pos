import Loader from "@/components/sites/Loader";
import { Transition } from "@headlessui/react";
import { Fragment, ReactNode, useRef } from 'react';
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
        <Transition         
        show={!isLoading}
        //as={Fragment}
        enter="transform transition-duration[600ms]"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transform transition-duration[600ms]"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
            {children instanceof Function ? children(data) : children}
        </Transition>
        
    );
}
