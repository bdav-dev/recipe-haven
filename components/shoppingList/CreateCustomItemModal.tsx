import { Modal, StyleSheet, View } from "react-native";
import FullScreenModal from "../FullScreenModal";
import { useContext, useState } from "react";
import TextField from "../TextField";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { AppTheme } from "@/types/ThemeTypes";
import { isBlank } from "@/utils/StringUtils";
import { createCustomItem } from "@/data/dao/ShoppingListDao";
import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import { ShoppingListContext } from "@/context/ShoppingListContextProvider";

type CreateCustomItemModalProps = {
    isVisible: boolean,
    onRequestClose?: () => void,
    onItemCreated?: (item: ShoppingListCustomItem) => void
}

export default function CreateCustomItemModal(props: CreateCustomItemModalProps) {
    const styles = useThemedStyleSheet(createStyles);
    const [text, setText] = useState('');
    const { setShoppingList } = useContext(ShoppingListContext);

    const isValidInput = (text: string) => !isBlank(text);

    const addItemToShoppingList = (newItem: ShoppingListCustomItem) => {
        setShoppingList(current => ({
            ...current,
            customItems: [...current.customItems, newItem]
        }));
    };

    async function handleSubmit() {
        const trimmedText = text.trim();
        if (!isValidInput(trimmedText)) return;

        try {
            const newItem = await createCustomItem({ text: trimmedText });
            addItemToShoppingList(newItem);
            close();
        } catch (error) {
            console.error('Failed to create item:', error);
        }
    }

    function close() {
        setText('');
        if (props.onRequestClose) {
            props.onRequestClose();
        }
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Neuer Artikel"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: handleSubmit,
                disabled: isBlank(text)
            }}
        >
            <View style={styles.contentContainer}>
                <TextField
                    placeholder="Name des Artikels"
                    value={text}
                    onChangeText={setText}
                    style={styles.textField}
                />
            </View>
        </FullScreenModal>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    contentContainer: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    textField: {
        width: "100%",
        fontSize: 24
    }
});