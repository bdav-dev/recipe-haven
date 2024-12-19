import { useState, useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Modal from "../modals/Modal";
import TextField from "../TextField";
import UnitPicker from "../ingredient/UnitPicker";
import { createIngredientItem } from "@/data/dao/ShoppingListDao";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import IngredientSearch from "./IngredientSearch";
import { Ingredient, QuantizedIngredient, Unit } from "@/types/IngredientTypes";
import { ThemedText } from "../themed/ThemedText";

type CreateIngredientItemModalProps = {
    isVisible: boolean,
    onRequestClose: () => void
}

export default function CreateIngredientItemModal(props: CreateIngredientItemModalProps) {
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);
    const [quantity, setQuantity] = useState('');
    const { setShoppingList } = useContext(ShoppingListContext);


    const handleCreate = async () => {
        if (!ingredient || !quantity) return;

        const quantizedIngredient: QuantizedIngredient = {
            ingredient,
            amount: parseFloat(quantity)
        };

        const newItem = await createIngredientItem({
            ingredient: quantizedIngredient
        });

        setShoppingList(current => ({
            ...current,
            ingredientItems: [...current.ingredientItems, newItem]
        }));

        props.onRequestClose();
    };

    return (
        <Modal
            isVisible={props.isVisible}
            onRequestClose={props.onRequestClose}
            title="Neue Zutat"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: handleCreate,
                disabled: !ingredient || !quantity
            }}
        >
            <View style={styles.contentContainer}>
                <View style={styles.searchContainer}>
                    <ThemedText type="defaultSemiBold">Zutat</ThemedText>
                    <IngredientSearch onSelectIngredient={setIngredient} />
                </View>
                <View style={styles.quantityContainer}>
                    <ThemedText type="defaultSemiBold">Menge</ThemedText>
                    <View style={styles.quantityInputContainer}>
                        <TextField
                            placeholder="Menge"
                            value={quantity}
                            onChangeText={setQuantity}
                            style={styles.quantityField}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
        gap: 16,
        width: "100%",
    },
    searchContainer: {
        gap: 8
    },
    quantityContainer: {
        gap: 8
    },
    quantityInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: 40
    },
    quantityField: {
        flex: 0.3,
        height: "100%",
        fontSize: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 4
    },
    unitPicker: {
        flex: 0.6,
        height: "100%"
    }
});
