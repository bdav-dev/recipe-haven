import { AppTheme } from "@/types/ThemeTypes";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const AppThemes: { [key: string]: AppTheme } = {
    light: {
        ...DefaultTheme.colors,

        accent: "#00d637",

        badge: {
            background: "#DBDBDB"
        },
        button: {
            default: "rgb(0, 122, 255)",
            destructive: "#EB4E3E",
            disabled: "#CDCDCD"
        },
        icon: {
            secondary: "#687076"
        },
        ingredientListItem: {
            borderWidth: 0
        },
        modal: {
            borderWidth: 0,
            shadowOpacity: 0.4
        },
        textField: {
            background: DefaultTheme.colors.border,
            placeholder: "#a9a9ab",
            borderErroneous: "#EB4E3E",
        }
    },
    dark: {
        ...DarkTheme.colors,

        accent: "#00ff41",

        badge: {
            background: "#292929"
        },
        button: {
            default: "rgb(10, 132, 255)",
            destructive: "#E75444",
            disabled: "#CACACA"
        },
        icon: {
            secondary: "#9BA1A6"
        },
        ingredientListItem: {
            borderWidth: 1
        },
        modal: {
            borderWidth: 0.5,
            shadowOpacity: 1
        },
        textField: {
            background: DarkTheme.colors.border,
            placeholder: "#616166",
            borderErroneous: "#E75444"
        }
    },
};

export const DefaultAppTheme = AppThemes.light;
