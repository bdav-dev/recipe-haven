import { useState, useContext, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "../modals/Modal";
import TextField from "../TextField";
import { createIngredientItem } from "@/data/dao/ShoppingListDao";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import { Ingredient, QuantizedIngredient } from "@/types/IngredientTypes";
import { ThemedText } from "../themed/ThemedText";
import { equalsIgnoreCase, includesIgnoreCase, isBlank } from "@/utils/StringUtils";
import IngredientSuggestion from "../recipe/IngredientSuggestion";
import { isValidAmount, unitToString } from "@/utils/UnitUtils";
import CardView from "../themed/CardView";
import IngredientItemPicker from "./IngredientItemPicker";

type CreateIngredientItemModalProps = {
    isVisible: boolean,
    onRequestClose: () => void,
    ingredientSuggestions: Ingredient[]
}

export default function CreateIngredientItemModal(props: CreateIngredientItemModalProps) {
    const [amountText, setAmountText] = useState('');
    const [ingredient, setIngredient] = useState<Ingredient>();
    const { setShoppingList } = useContext(ShoppingListContext);


    const handleCreate = async () => {
        const amount = +amountText;
        if (!ingredient || !isValidAmount(+amount))
            return;

        const quantizedIngredient: QuantizedIngredient = {
            ingredient,
            amount
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
            title="Neuer Eintrag"
            rightButton={{
                title: "Hinzufügen",
                onPress: handleCreate,
                disabled: !ingredient || !isValidAmount(+amountText)
            }}
        >
            <CardView style={styles.main} title="Zutat">
                <IngredientItemPicker
                    amountText={amountText}
                    setAmountText={setAmountText}
                    ingredientSuggestions={props.ingredientSuggestions}
                    ingredient={ingredient}
                    setIngredient={setIngredient}
                />
            </CardView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    ingredientSuggestionView: {
        position: "absolute",
        bottom: 38,
        width: "100%",
        overflow: "hidden",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 3
    },
    amountTextField: {
        minWidth: 80,
        textAlign: "center"
    },
    main: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        margin: 4
    }
});
