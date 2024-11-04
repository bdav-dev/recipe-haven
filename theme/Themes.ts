import { AppTheme } from "@/types/ThemeTypes";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const AppThemes: { [key: string]: AppTheme } = {
    light: {
        ...DefaultTheme.colors,

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
        ...DarkTheme.colors,

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
