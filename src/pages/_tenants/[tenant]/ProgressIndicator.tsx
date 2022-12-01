import React from "react";
import { RadialProgress } from "./RadialProgress";
import { useProgressIndicator } from "./useProgressIndicator";

export function ProgressIndicator() {
    const [_, __, data] = useProgressIndicator();
    const { animated, children, value, speed, show } = data ?? {};
    return (<div className={`toast toast-center toast-middle z-40 ${!show ? "hidden" : ""}`}>
        {/* add an indicator here */}
        <RadialProgress animated={animated} value={value} speed={speed}>
            {children}
        </RadialProgress>
    </div>);
}
