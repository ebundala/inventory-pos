import React from "react";
import { WithChildren } from "@/types";
import { HostContext } from "../hooks/useHost";



export function HostProvider({ host, children, ...rest }: { host: string; } & WithChildren) {
  return (
    <HostContext.Provider value={host} {...rest}>
      {children}
    </HostContext.Provider>
  );
}
