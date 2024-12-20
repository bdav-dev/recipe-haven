export type AppTheme = {
    primary: string,
    background: string,
    card: string,
    text: string,
    border: string,
    notification: string,

    accent: string,

    badge: {
        background: string
    },
    button: {
        default: string,
        destructive: string,
        disabled: string
    },
    icon: {
        secondary: string,
    },
    ingredientListItem: {
        borderWidth: number
    },
    modal: {
        borderWidth: number,
        shadowOpacity: number
    }
    textField: {
        background: string,
        placeholder: string,
        borderErroneous: string,
        readOnlyBackground: string
    },
    autoColorBadge: {
        backgroundColor: {
            saturation: number,
            value: number
        },
        border: {
            saturation: number,
            value: number
        },
        text: {
            saturation: number,
            value: number
        }
    },
    ingredientsPreview: {
        moreBadge: {
            backgroundColor: string
        }
    }
}
