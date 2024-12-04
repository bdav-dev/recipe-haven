import { StyleSheet, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useContext, useState } from "react";
import TextField from "../TextField";
import { isBlank } from "@/utils/StringUtils";
import { createCustomItem } from "@/data/dao/ShoppingListDao";
import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";
import CardView from "../themed/CardView";

type CreateCustomItemModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void,
    onItemCreated?: (item: ShoppingListCustomItem) => void
}

export default function CreateCustomItemModal(props: CreateCustomItemModalProps) {
    const [text, setText] = useState('');
    const { setShoppingList } = useContext(ShoppingListContext);

    const isValidInput = !isBlank(text);

    async function handleSubmit() {
        if (!isValidInput) return;

        try {
            const newItem = await createCustomItem({ text: text.trim() });
            setShoppingList(current => ({
                ...current,
                customItems: [...current.customItems, newItem]
            }));
            handleClose();
        } catch (error) {
            console.error('Failed to create item:', error);
        }
    }

    function handleClose() {
        setText('');
        props.onRequestClose?.();
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={handleClose}
            title="Neuer Artikel"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: handleSubmit,
                disabled: !isValidInput
            }}
        >
            <View style={styles.contentContainer}>
                <CardView style={styles.inputCard}>
                    <TextField
                        placeholder="Name des Artikels"
                        value={text}
                        onChangeText={setText}
                        style={styles.textField}
                    />
                </CardView>
            </View>
        </FullScreenModal>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 20,
        gap: 12,
        width: "100%",
    },
    inputCard: {
        padding: 16,
    },
    textField: {
        width: "100%",
        fontSize: 24
    }
});