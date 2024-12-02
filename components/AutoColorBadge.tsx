import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed/ThemedText";
import { djb2Normalized } from "@/utils/HashUtils";
import { hsvToColor } from "@/utils/ColorUtils";
import { AppTheme } from "@/types/ThemeTypes";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useMemo } from "react";

type AutoColorBadgeProps = {
    text: string,
    saturationMultiplier?: number,
    valueMultiplier?: number
}

export default function AutoColorBadge(props: AutoColorBadgeProps) {
    const theme = useAppTheme();
    const hue = djb2Normalized(props.text);

    const styles = useMemo(
        () => createStyles(
            theme,
            hue,
            props.saturationMultiplier,
            props.valueMultiplier
        ),
        [hue, theme, props.saturationMultiplier, props.valueMultiplier]
    );

    return (
        <View style={styles.badge}>
            <ThemedText style={styles.text}>{props.text}</ThemedText>
        </View>
    );
}

const createStyles = (theme: AppTheme, hue: number, saturationMultiplier?: number, valueMultiplier?: number) => {
    const hueAngle = hue * 360;
    const values = theme.autoColorBadge;

    const backgroundColor = hsvToColor(
        hueAngle,
        values.backgroundColor.saturation * (saturationMultiplier ?? 1),
        values.backgroundColor.value * (valueMultiplier ?? 1)
    );
    const borderColor = hsvToColor(
        hueAngle,
        values.border.saturation * (saturationMultiplier ?? 1),
        values.border.value * (valueMultiplier ?? 1)
    );
    const textColor = hsvToColor(
        hueAngle,
        values.text.saturation * (saturationMultiplier ?? 1),
        values.text.value * (valueMultiplier ?? 1)
    );

    return StyleSheet.create({
        badge: {
            borderRadius: 9999,
            paddingHorizontal: 7,
            borderWidth: 1,
            borderColor,
            backgroundColor
        },
        text: {
            color: textColor
        }
    });
}
