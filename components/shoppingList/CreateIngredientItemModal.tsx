import { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import Modal from "../modals/Modal";
import TextField from "../TextField";
import UnitPicker from "../ingredient/UnitPicker";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { createIngredientItem } from "@/data/dao/ShoppingListDao";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import IngredientSearch from "./IngredientSearch";
import { Ingredient, QuantizedIngredient, Unit } from "@/types/IngredientTypes";

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
            ingredient: quantizedIngredient,
            quantity: parseFloat(quantity)
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
                <IngredientSearch onSelectIngredient={setIngredient} />
                <View style={styles.quantityContainer}>
                    <TextField
                        placeholder="Menge"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={styles.quantityField}
                    />
                    <UnitPicker
                        selectedUnit={ingredient?.unit || Unit.GRAMM}
                        onUnitChange={() => {}}
                        disabled
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
        gap: 12,
        width: "100%",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    quantityField: {
        flex: 1,
        fontSize: 24
    }
});
