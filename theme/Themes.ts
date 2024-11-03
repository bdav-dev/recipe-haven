import { AppTheme } from "@/types/ThemeTypes";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const reactNativeDarkTheme = DarkTheme;
const reactNativeDefaultTheme = DefaultTheme;

export const AppThemes: { [key: string]: AppTheme } = {
    light: {
        primary: reactNativeDefaultTheme.colors.primary,
        background: reactNativeDefaultTheme.colors.background,
        card: reactNativeDefaultTheme.colors.card,
        text: reactNativeDefaultTheme.colors.text,
        border: reactNativeDefaultTheme.colors.border,
        notification: reactNativeDefaultTheme.colors.notification,

        accent: "#00d637",
        iconSecondary: "#687076",
        modal: {
            borderWidth: 0,
            shadowOpacity: 0.4
        },
        ingredientListItem: {
            borderWidth: 0
        },
        erroneousTextFieldBorder: "#FF0221",
        badgeBackground: "#DBDBDB"
    },
    dark: {
        primary: reactNativeDarkTheme.colors.primary,
        background: reactNativeDarkTheme.colors.background,
        card: reactNativeDarkTheme.colors.card,
        text: reactNativeDarkTheme.colors.text,
        border: reactNativeDarkTheme.colors.border,
        notification: reactNativeDarkTheme.colors.notification,

        accent: "#00ff41",
        iconSecondary: "#9BA1A6",
        modal: {
            borderWidth: 0.5,
            shadowOpacity: 1
        },
        ingredientListItem: {
            borderWidth: 1
        },
        erroneousTextFieldBorder: "#FF0221",
        badgeBackground: "#292929"
    },
};

export const DefaultAppTheme = AppThemes.light;
