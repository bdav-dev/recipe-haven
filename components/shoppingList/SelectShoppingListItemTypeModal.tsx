import { StyleSheet, View, TouchableOpacity } from "react-native";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import Modal from "../modals/Modal";

type SelectShoppingListItemTypeModalProps = {
    isVisible: boolean;
    onRequestClose: () => void;
    onSelectCustomItem: () => void;
    onSelectIngredient: () => void;
    onSelectRecipe: () => void;
}

export default function SelectShoppingListItemTypeModal(props: SelectShoppingListItemTypeModalProps) {

    return (
        <Modal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
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
        </Modal>
    );
}

const styles = StyleSheet.create({
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