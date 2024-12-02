import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { Duration } from "@/data/misc/Duration";

type DurationLabelProps = {
    duration: Duration
}

export default function DurationLabel(props: DurationLabelProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <View style={styles.view}>
            <Ionicons name="time-outline" style={styles.icon}/>
            <ThemedText>{props.duration.toString()}</ThemedText>
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    view: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 3
    },
    icon: {
        color: theme.text,
        fontSize: 22
    }
});

