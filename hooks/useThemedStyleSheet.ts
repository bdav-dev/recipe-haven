import { AppTheme } from "@/types/ThemeTypes";
import { useAppTheme } from "./useAppTheme";
import { useMemo } from "react";

export function useThemedStyleSheet<T>(styleSheetProvider: (theme: AppTheme) => T) {
    const theme = useAppTheme();
    const stylesheet = useMemo(() => styleSheetProvider(theme), [theme]);

    return stylesheet;
}