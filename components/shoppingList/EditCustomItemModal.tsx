import { Alert, View } from "react-native";
import TextField from "../TextField";
import { useContext, useEffect, useState } from "react";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import { isBlank } from "@/utils/StringUtils";
import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import { deleteCustomItem, updateCustomItem } from "@/data/dao/ShoppingListDao";
import Button from "../Button";
import FullScreenModal from "../modals/FullScreenModal";
import Modal from "../modals/Modal";

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
            primaryActionButton={{
                title: "Speichern",
                onPress: update,
                disabled: !isReadyForSubmit()
            }}
        >
            <View>
                <TextField
                    placeholder="Text"
                    onChangeText={setText}
                >
                    {props.editItem?.text}
                </TextField>

                <Button 
                    style={{ marginTop: 16 }} 
                    title="Eintrag löschen" 
                    ionicon="trash-outline" 
                    type="destructive" 
                    onPress={showConfirmDeleteAlert} 
                />
            </View>
        </Modal>
    );
}