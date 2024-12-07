import { StyleSheet, View } from "react-native";
import { useContext, useState } from "react";
import { Ingredient, QuantizedIngredient } from "@/types/IngredientTypes";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import { createIngredientItem } from "@/data/dao/ShoppingListDao";
import FullScreenModal from "../modals/FullScreenModal";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import { unitToString } from "@/utils/UnitUtils";
import { isBlank } from "@/utils/StringUtils";
import CardView from "../themed/CardView";

type CreateIngredientItemModalProps = {
    isVisible: boolean;
    selectedIngredient?: Ingredient;
    onRequestClose: () => void;
}

export default function CreateIngredientItemModal(props: CreateIngredientItemModalProps) {
    const [amount, setAmount] = useState('');
    const { setShoppingList } = useContext(ShoppingListContext);

    const isValidInput = !isBlank(amount) && !isNaN(Number(amount)) && Number(amount) > 0;

    async function handleSubmit() {
        if (!isValidInput || !props.selectedIngredient) return;

        const quantizedIngredient: QuantizedIngredient = {
            ...props.selectedIngredient,
            quantity: Number(amount)
        };

        try {
            const newItem = await createIngredientItem({
                ingredient: quantizedIngredient
            });

            setShoppingList(current => ({
                ...current,
                ingredientItems: [...current.ingredientItems, newItem]
            }));
            handleClose();
        } catch (error) {
            console.error('Failed to create ingredient item:', error);
        }
    }

    function handleClose() {
        setAmount('');
        props.onRequestClose();
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={handleClose}
            title="Menge eingeben"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: handleSubmit,
                disabled: !isValidInput
            }}
        >
            <CardView style={styles.container}>
                <TextField
                    placeholder="Menge"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    style={styles.input}
                />
                {props.selectedIngredient && (
                    <ThemedText type="defaultSemiBold">
                        {unitToString(props.selectedIngredient.unit)}
                    </ThemedText>
                )}
            </CardView>
        </FullScreenModal>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12
    },
    input: {
        fontSize: 20
    }
});
