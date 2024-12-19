import { Alert, View, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import { ShoppingListIngredientItem } from "@/types/ShoppingListTypes";
import { deleteIngredientItem, updateIngredientItem } from "@/data/dao/ShoppingListDao";
import Button from "../Button";
import Modal from "../modals/Modal";
import TextField from "../TextField";
import { ThemedText } from "../themed/ThemedText";
import IngredientSearch from "./IngredientSearch";
import { Ingredient } from "@/types/IngredientTypes";

type EditIngredientItemModalProps = {
    isVisible: boolean;
    onRequestClose?: () => void;
    editItem?: ShoppingListIngredientItem;
}

export default function EditIngredientItemModal(props: EditIngredientItemModalProps) {
    const { setShoppingList } = useContext(ShoppingListContext);
    const [quantity, setQuantity] = useState('');
    const [ingredient, setIngredient] = useState<Ingredient | null>(null);

    useEffect(() => {
        reset();
    }, [props.editItem]);

    function reset() {
        if (props.editItem) {
            setQuantity(props.editItem.ingredient.amount.toString());
            setIngredient(props.editItem.ingredient.ingredient);
        }
    }

    function close() {
        reset();
        props.onRequestClose?.();
    }

    function isReadyForSubmit() {
        return ingredient && quantity;
    }

    function update() {
        if (!props.editItem || !ingredient || !quantity) return;

        const updatedItem = {
            ...props.editItem,
            ingredient: {
                ingredient: ingredient,
                amount: parseFloat(quantity)
            }
        };

        updateIngredientItem({
            originalItem: props.editItem,
            updatedValues: updatedItem
        })
        .then(() => {
            setShoppingList(current => ({
                ...current,
                ingredientItems: current.ingredientItems.map(item =>
                    item.shoppingListIngredientItemId === updatedItem.shoppingListIngredientItemId
                        ? updatedItem
                        : item
                )
            }));
            close();
        });
    }

    function remove() {
        if (!props.editItem) return;

        deleteIngredientItem(props.editItem)
        .then(() => {
            setShoppingList(current => ({
                ...current,
                ingredientItems: current.ingredientItems.filter(item =>
                    item.shoppingListIngredientItemId !== props.editItem?.shoppingListIngredientItemId
                )
            }));
            close();
        });
    }

    function showConfirmDeleteAlert() {
        Alert.alert('Zutat löschen', 'Möchtest du diese Zutat wirklich löschen?', [
            {
                text: 'Abbrechen'
            },
            {
                text: 'Löschen',
                onPress: remove,
                style: "destructive"
            }
        ]);
    }

    return (
        <Modal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Zutat bearbeiten"
            primaryActionButton={{
                title: "Speichern",
                onPress: update,
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>
                <View style={styles.searchContainer}>
                    <ThemedText type="defaultSemiBold">Zutat</ThemedText>
                    <IngredientSearch 
                        onSelectIngredient={setIngredient}
                    />
                </View>
                <View style={styles.quantityContainer}>
                    <ThemedText type="defaultSemiBold">Menge</ThemedText>
                    <TextField
                        placeholder="Menge"
                        value={quantity}
                        onChangeText={setQuantity}
                        style={styles.quantityField}
                        keyboardType="numeric"
                    />
                </View>

                <Button 
                    style={styles.deleteButton} 
                    title="Zutat löschen" 
                    ionicon="trash-outline" 
                    type="destructive" 
                    onPress={showConfirmDeleteAlert} 
                />
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
    quantityField: {
        height: 40,
        fontSize: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderRadius: 4
    },
    deleteButton: {
        marginTop: 16
    }
});
