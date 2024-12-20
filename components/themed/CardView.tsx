import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText } from "./ThemedText";
import { AppTheme } from "@/types/ThemeTypes";

type CardViewProps = ViewProps & {
    title?: string,
    noPadding?: boolean
}

const padding = 11;

export default function CardView({
    noPadding,
    title,
    children,
    style,
    ...rest
}: CardViewProps) {
    const styles = useThemedStyleSheet(createStyles)

    return (
        <View
            style={[
                styles.cardView,
                {
                    padding: noPadding ? 0 : padding,
                    paddingTop: noPadding
                        ? 0
                        : title ? 33 : padding
                },
                style
            ]}
            {...rest}
        >
            {title && <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>{title}</ThemedText>}
            {children}
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    cardView: {
        backgroundColor: theme.card,
        borderRadius: 13,
        position: "relative",
    },
    title: {
        position: "absolute",
        top: 10,
        left: 10
    }
});
