import React from "react";
import { useContext } from "react";
import { TenantProp } from "@/types/TenantProp";
export const TenantContext = React.createContext<TenantProp>(null);

export function useTenant() {
  return useContext<TenantProp>(TenantContext);
}
