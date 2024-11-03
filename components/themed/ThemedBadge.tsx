import { StyleSheet, TextProps, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type ThemedBadgeProps = TextProps;

export default function ThemedBadge({
    children,
    style,
    ...rest
}: ThemedBadgeProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <View style={styles.badge}>
            <ThemedText
                style={style}
                {...rest}
            >
                {children}
            </ThemedText>
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    badge: {
        borderRadius: 99,
        paddingHorizontal: 8,
        backgroundColor: theme.badgeBackground
    }
});