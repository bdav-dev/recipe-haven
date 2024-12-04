import { StyleSheet, View, TouchableOpacity } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";

type SelectShoppingListItemTypeModalProps = {
    isVisible: boolean;
    onRequestClose: () => void;
    onSelectCustomItem: () => void;
    onSelectIngredient: () => void;
    onSelectRecipe: () => void;
}

export default function SelectShoppingListItemTypeModal(props: SelectShoppingListItemTypeModalProps) {
    const styles = useThemedStyleSheet(createStyles);

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Neuer Eintrag"
        >
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={props.onSelectIngredient}>
                    <CardView style={styles.optionCard}>
                        <ThemedText type="largeSemiBold">Zutat</ThemedText>
                    </CardView>
                </TouchableOpacity>

                <TouchableOpacity onPress={props.onSelectCustomItem}>
                    <CardView style={styles.optionCard}>
                        <ThemedText type="largeSemiBold">Artikel</ThemedText>
                    </CardView>
                </TouchableOpacity>

                <TouchableOpacity onPress={props.onSelectRecipe}>
                    <CardView style={styles.optionCard}>
                        <ThemedText type="largeSemiBold">Aus Rezept</ThemedText>
                    </CardView>
                </TouchableOpacity>
            </View>
        </FullScreenModal>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
    },
    optionCard: {
        padding: 10,
        alignItems: "center"
    }
});