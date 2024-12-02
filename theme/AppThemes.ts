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
        },
        autoColorBadge: {
            backgroundColor: {
                saturation: 0.145539,
                value: 0.991112
            },
            border: {
                saturation: 0.218717,
                value: 0.973443
            },
            text: {
                saturation: 0.777718,
                value: 0.2
            }
        },
        ingredientsPreview: {
            moreBadge: {
                backgroundColor: DefaultTheme.colors.border
            }
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
        },
        autoColorBadge: {
            backgroundColor: {
                saturation: 0.734477,
                value: 0.043734 + 0.11
            },
            border: {
                saturation: 0.790038,
                value: 0.076185 + 0.15
            },
            text: {
                saturation: 0.27415,
                value: 1
            }
        },
        ingredientsPreview: {
            moreBadge: {
                backgroundColor: DarkTheme.colors.border
            }
        }
    },
};

export const DefaultAppTheme = AppThemes.light;
