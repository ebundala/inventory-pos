import React from "react";
import { WithChildren } from "@/types";
import { TenantProp } from "@/types/TenantProp";
import { TenantContext } from "@/lib/hooks/useTenant";



export function TenantProvider({ tenant, children, ...rest }: { tenant: TenantProp; } & WithChildren) {
  return (
    <TenantContext.Provider value={tenant} {...rest}>
      {children}
    </TenantContext.Provider>
  );
}
