import { Alert, StyleSheet, View } from "react-native";
import TextField from "../TextField";
import { useContext, useEffect, useState } from "react";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import { isBlank } from "@/utils/StringUtils";
import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import { deleteCustomItem, updateCustomItem } from "@/data/dao/ShoppingListDao";
import Button from "../Button";
import FullScreenModal from "../modals/FullScreenModal";
import Modal from "../modals/Modal";
import CardView from "../themed/CardView";

type EditCustomItemModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void,
    editItem?: ShoppingListCustomItem
}

export default function EditCustomItemModal(props: EditCustomItemModalProps) {
    const { setShoppingList } = useContext(ShoppingListContext);
    const [text, setText] = useState('');

    useEffect(() => {
        reset();
    }, [props.editItem]);

    function reset() {
        setText(props.editItem?.text ?? '');
    }

    function close() {
        reset();
        props.onRequestClose?.();
    }

    function isReadyForSubmit() {
        return !isBlank(text);
    }

    function update() {
        if (!props.editItem) return;

        updateCustomItem({
            originalItem: props.editItem,
            updatedValues: {
                ...props.editItem,
                text: text
            }
        })
            .then(updatedItem => {
                setShoppingList(current => ({
                    ...current,
                    customItems: current.customItems.map(item =>
                        item.shoppingListCustomItemId === updatedItem.shoppingListCustomItemId
                            ? updatedItem
                            : item
                    )
                }));
                close();
            });
    }

    function remove() {
        if (!props.editItem) return;

        deleteCustomItem(props.editItem)
            .then(() => {
                setShoppingList(current => ({
                    ...current,
                    customItems: current.customItems.filter(item =>
                        item.shoppingListCustomItemId !== props.editItem?.shoppingListCustomItemId
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
            title="Eintrag bearbeiten"
            rightButton={{
                title: "Speichern",
                onPress: update,
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.view}>
                <TextField
                    placeholder="Text"
                    onChangeText={setText}
                    style={styles.textField}
                >
                    {props.editItem?.text}
                </TextField>

                <Button
                    style={{ marginVertical: 10 }}
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
    view: {
        padding: 8
    },
    textField: {
        width: "100%",
        fontSize: 24
    }
});
