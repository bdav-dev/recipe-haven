import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

export default function NoIngredientsInfo() {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <View style={styles.container}>
            <CardView style={styles.noIngredientsCard}>
                <Ionicons name='sad-outline' color={theme.icon.secondary} size={56} />
                <ThemedText type="subtitle" style={styles.text}>Keine Zutaten</ThemedText>
                <ThemedText style={styles.text}>Füge jetzt Zutaten hinzu!</ThemedText>
            </CardView>
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        flex: 1
    },
    noIngredientsCard: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        alignSelf: "center",
        shadowColor: "black",
        shadowRadius: 15,
        shadowOpacity: 0.1,
        borderColor: theme.border,
        borderWidth: theme.modal.borderWidth
    },
    text: {
        color: theme.icon.secondary
    }
});