import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import CardView from "./themed/CardView";
import { ThemedText } from "./themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type NoItemsInfoProps = {
    type: 'recipes' | 'ingredients';
}

export default function NoItemsInfo(props: NoItemsInfoProps) {
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    let text: string;
    switch (props.type) {
        case "recipes":
            text = "Rezepte";
            break;
        case "ingredients":
            text = "Zutaten";
            break;
    }

    return (
        <View style={styles.container}>
            <CardView style={styles.noIngredientsCard}>
                <Ionicons name='sad-outline' color={theme.icon.secondary} size={56} />
                <ThemedText type="subtitle" style={styles.text}>Keine {text}</ThemedText>
                <ThemedText style={styles.text}>Füge jetzt {text} hinzu!</ThemedText>
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