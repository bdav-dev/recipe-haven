import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { AppTheme } from "@/types/ThemeTypes";

type CardViewProps = ViewProps & {
    title?: string
}

const padding = 11;

export default function CardView({
    title,
    children,
    style,
    ...rest
}: CardViewProps) {
    const styles = useThemedStyleSheet(theme => createStyles(theme))

    return (
        <View
            style={[
                styles.cardView,
                { paddingTop: title ? 37 : padding },
                style
            ]}
            {...rest}
        >
            {
                title && <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
            }

            {children}
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    cardView: {
        backgroundColor: theme.card,
        borderRadius: 13,
        padding: padding,
        position: "relative"
    },
    title: {
        position: "absolute",
        top: 10,
        left: 10
    }
});