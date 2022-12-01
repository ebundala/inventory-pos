import React from "react";
import { WithChildren } from "@/types";
import {ThemeListContext} from '@/lib/hooks/useThemesList';
export function ThemesListProvider({ themes, children, ...rest }: { themes: string[]; } & WithChildren) {
    return (
        <ThemeListContext.Provider value={themes} {...rest}>
            {children}
        </ThemeListContext.Provider>
    );
}
