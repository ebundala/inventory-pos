import React from "react";
import { useContext } from "react";

export const HostContext = React.createContext<string>(process.env.APP_HOST!);
export function useHost() {
  return useContext<string>(HostContext);
}
