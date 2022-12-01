import React, { useEffect, useState } from "react";
import { ProgressIndicatorData } from "./ProgressIndicatorData";

export function RadialProgress({ animated, value = 0, speed = 1, children }: ProgressIndicatorData) {
    const [progress, setValue] = useState(value);
    useEffect(() => {
        requestAnimationFrame(() => {
            if (!animated)
                return;
            if (progress >= 100) {
                setValue(0);
            } else {
                setValue((p) => p + speed);
            }
        });
    }, [progress, animated, value, speed]);
    const child = children instanceof Function ? children!({ value: progress, animated, speed }) : children;
    return (<div className="radial-progress text-primary z-40" {...({ style: { "--value": progress } } as any)}>{child ?? `${progress}%`}</div>
    );
}
