import { StyleSheet, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useState } from "react";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { TouchableOpacity } from "react-native";
import CreateCustomItemModal from "./CreateCustomItemModal";

type SelectShoppingListItemTypeModalProps = {
    isVisible: boolean;
    onRequestClose?: () => void;
    onSelectCustomItem?: () => void;
    onSelectIngredient?: () => void;
    onSelectRecipe?: () => void;
}

type ModalType = 'selection' | 'custom' | 'ingredient' | 'recipe' | null;

export default function SelectShoppingListItemTypeModal(props: SelectShoppingListItemTypeModalProps) {
    const styles = useThemedStyleSheet(createStyles);
    const [activeModal, setActiveModal] = useState<ModalType>('selection');

    function handleCustomItemSelect() {
        setActiveModal('custom');
    }

    function handleIngredientSelect() {
        setActiveModal('ingredient');
        // TODO: Implement ingredient modal
    }

    function handleRecipeSelect() {
        setActiveModal('recipe');
        // TODO: Implement recipe modal
    }

    function handleClose() {
        setActiveModal('selection');
        if (props.onRequestClose) {
            props.onRequestClose();
        }
    }

    if (activeModal === 'custom') {
        return (
            <CreateCustomItemModal 
                isVisible={props.isVisible}
                onRequestClose={() => setActiveModal('selection')}
            />
        );
    }

    // TODO: Add similar conditions for ingredient and recipe modals

    return (
        <FullScreenModal
            isVisible={props.isVisible && activeModal === 'selection'}
            onRequestClose={handleClose}
            title="Neuer Eintrag"
        >
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={handleIngredientSelect}>
                    <CardView style={styles.optionCard}>
                        <ThemedText type="largeSemiBold">Zutat</ThemedText>
                    </CardView>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCustomItemSelect}>
                    <CardView style={styles.optionCard}>
                        <ThemedText type="largeSemiBold">Artikel</ThemedText>
                    </CardView>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRecipeSelect}>
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