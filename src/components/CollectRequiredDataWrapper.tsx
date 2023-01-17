import Loader from "@/components/sites/Loader";
import { useProgressIndicator } from "@/lib/hooks/useProgressIndicator";
import { Transition } from "@headlessui/react";
import { Fragment, ReactNode, useEffect, useRef, useState } from 'react';
import { RadialProgress } from "./RadialProgress";
export type CollectHooksReturnType<T extends unknown = unknown> = { data: T; isLoading: boolean; }
export function CollectRequiredDataWrapper({ useHooks, children }: {
    useHooks: () => CollectHooksReturnType;
    children: ReactNode | {
        (props: any): ReactNode;
    };
}): JSX.Element {
    const { data, isLoading } = useHooks();
    const [loading, setLoading] = useState(true);
    const [showProgress, hideProgress] = useProgressIndicator()

    useEffect(() => {
        setLoading(isLoading);

    }, [isLoading])

    // if (isLoading)
    //     return 

    return (
        <>
         <Transition
            show={loading}
          //  as={Fragment}
            enter="transform transition duration-[200ms]"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="transform transition duration-[200ms]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
        <div className="w-full h-screen md:pb-80 flex flex-col items-center justify-center">
            <div className="w-8 h-8 ">
                <RadialProgress animated={true} ></RadialProgress>
            </div>
        </div>
        </Transition>
        <Transition
            show={!loading}
            //as={Fragment}
            enter="transform transition duration-[600ms]"
            enterFrom="opacity-0 "
            enterTo="opacity-100 "
            leave="transform transition duration-[600ms]"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >   
            {children instanceof Function ? children(data) : children}
            
        </Transition>
        </>
    );
}
