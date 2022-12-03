import React, {useContext } from "react";
import themes from '@/lib/themes/themes';
export const ThemeListContext = React.createContext<string[]>(themes)
export const useThemesList = () =>{
    return useContext<string[]>(ThemeListContext);
}