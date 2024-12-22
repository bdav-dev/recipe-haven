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
import CardView from "../themed/CardView";
import IngredientItemPicker from "./IngredientItemPicker";
import { isValidAmount } from "@/utils/UnitUtils";

type EditIngredientItemModalProps = {
    isVisible: boolean;
    onRequestClose?: () => void;
    editItem?: ShoppingListIngredientItem;
    ingredientSuggestions: Ingredient[]
}

export default function EditIngredientItemModal(props: EditIngredientItemModalProps) {
    const { setShoppingList } = useContext(ShoppingListContext);
    const [ingredient, setIngredient] = useState<Ingredient>();
    const [amountText, setAmountText] = useState('');

    useEffect(() => {
        reset();
    }, [props.editItem]);

    function reset() {
        if (props.editItem) {
            setAmountText(props.editItem.ingredient.amount.toString());
            setIngredient(props.editItem.ingredient.ingredient);
        }
    }

    function close() {
        reset();
        props.onRequestClose?.();
    }

    function isReadyForSubmit() {
        return ingredient && isValidAmount(+amountText);
    }

    function update() {
        const amount = +amountText;
        if (!props.editItem || !ingredient || !isValidAmount(amount)) return;

        const updatedItem = {
            ...props.editItem,
            ingredient: {
                ingredient: ingredient,
                amount
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
        Alert.alert('Eintrag löschen', 'Möchtest du diesen Eintrag wirklich löschen?', [
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
            rightButton={{
                title: "Speichern",
                onPress: update,
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>
                <CardView style={styles.main} title="Zutat">
                    <IngredientItemPicker
                        initialIngredientText={ingredient?.name}
                        amountText={amountText}
                        setAmountText={setAmountText}
                        ingredientSuggestions={props.ingredientSuggestions}
                        ingredient={ingredient}
                        setIngredient={setIngredient}
                    />
                </CardView>

                <Button
                    style={styles.deleteButton}
                    title="Eintrag löschen"
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
        marginVertical: 10
    },
    main: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
        margin: 4
    }
});
