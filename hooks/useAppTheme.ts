import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";


export function useAppTheme() {
    
    const colorScheme = useColorScheme();

    return AppThemes[
        colorScheme ?? "light"
    ];
}

export type AppTheme = {
    primary: string,
    background: string,
    card: string,
    text: string,
    border: string,
    notification: string,

    accent: string,
    // headerBackground: string,
    iconSecondary: string,
    modal: {
        borderWidth: number,
        shadowOpacity: number
    }
    
}

const darkTheme = DarkTheme;
const lightTheme = DefaultTheme;



const AppThemes: { [key: string]: AppTheme } = {
    light: {
        primary: lightTheme.colors.primary,
        background: lightTheme.colors.background,
        card: lightTheme.colors.card,
        text: lightTheme.colors.text,
        border: lightTheme.colors.border,
        notification: lightTheme.colors.notification,

        accent: "#00d637",
        iconSecondary: "#687076",
        modal: {
            borderWidth: 0,
            shadowOpacity: 0.4
        }
    },
    dark: {
        primary: darkTheme.colors.primary,
        background: darkTheme.colors.background,
        card: darkTheme.colors.card,
        text: darkTheme.colors.text,
        border: darkTheme.colors.border,
        notification: darkTheme.colors.notification,

        accent: "#00ff41",
        iconSecondary: "#9BA1A6",
        modal: {
            borderWidth: 0.5,
            shadowOpacity: 1
        }
    },
};

export const DefaultAppTheme = AppThemes.light;