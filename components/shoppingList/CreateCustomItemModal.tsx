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
    const { shoppingList, setShoppingList } = useContext(ShoppingListContext);

    function isReadyForSubmit() {
        return !isBlank(text);
    }

    function reset() {
        setText('');
    }

    function close() {
        reset();
        if (props.onRequestClose) {
            props.onRequestClose();
        }
    }

    const handleCreate = async (text: string) => {
        try {
            const newItem = await createCustomItem({ text });
            setShoppingList(current => ({
                ...current,
                customItems: [...current.customItems, newItem]
            }));
            if (props.onItemCreated) {
                props.onItemCreated(newItem);
            }
            close();
        } catch (error) {
            console.error('Failed to create custom item:', error);
        }
    };

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Neuer Artikel"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: () => handleCreate(text),
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>
                <TextField
                    placeholder="Name des Artikels"
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