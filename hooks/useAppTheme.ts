import { AppThemes } from "@/theme/Themes";
import { useColorScheme } from "react-native";

export function useAppTheme() {
    const colorScheme = useColorScheme();

    return AppThemes[
        colorScheme ?? "light"
    ];
}
