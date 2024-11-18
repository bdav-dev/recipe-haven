import { useAppTheme } from "@/hooks/useAppTheme";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { StyleSheet, View } from "react-native";
import CardView from "./themed/CardView";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";

export default function NoResultsInfo() {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <View style={styles.container}>
            <CardView style={styles.noIngredientsCard}>
                <Ionicons name='search-outline' color={theme.icon.secondary} size={56} />
                <ThemedText type="subtitle" style={styles.text}>Keine Ergebnisse</ThemedText>
                <ThemedText style={styles.text}>Deine Suche ergab keine Treffer</ThemedText>
            </CardView>
        </View>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 10
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
