import { StyleSheet, View } from "react-native";
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

    function create() {
        createCustomItem({ text })
            .then(item => {
                setShoppingList({
                    ...shoppingList,
                    customItems: [...shoppingList.customItems, item]
                });
                close();
                if (props.onItemCreated) {
                    props.onItemCreated(item);
                }
            });
    }

    return (
        <FullScreenModal
            isVisible={props.isVisible}
            onRequestClose={close}
            title="Neuer Einkaufsgegenstand"
            primaryActionButton={{
                title: "Hinzufügen",
                onPress: () => create(),
                disabled: !isReadyForSubmit()
            }}
        >
            <View style={styles.contentContainer}>
                <TextField
                    placeholder="Name des Gegenstands"
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