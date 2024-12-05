import { ShoppingListCustomItem } from "@/types/ShoppingListTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type CustomShoppingListItemProps = {
    item: ShoppingListCustomItem;
    onToggleCheck: (item: ShoppingListCustomItem) => void;
    editButton?: { onPress: () => void };
}

export default function CustomShoppingListItem(props: CustomShoppingListItemProps) {
    const { item, onToggleCheck, editButton } = props;
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <CardView style={styles.card} noPadding>
            <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onToggleCheck(item)}
            >
                <Ionicons 
                    name={item.isChecked ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={theme.primary} 
                />
            </TouchableOpacity>

            <View style={styles.contentContainer}>
                <ThemedText 
                    type="largeSemiBold" 
                    style={item.isChecked ? styles.checkedText : undefined}
                >
                    {item.text}
                </ThemedText>
            </View>

            {
                editButton &&
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={editButton.onPress}>
                    <Ionicons name="pencil-outline" size={24} color={theme.primary} />
                </TouchableOpacity>
            }
        </CardView>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    card: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        borderWidth: theme.ingredientListItem.borderWidth,
        borderColor: theme.border
    },
    actionButton: {
        padding: 16,
    },
    contentContainer: {
        flex: 1,
        marginRight: 16,
    },
    checkedText: {
        textDecorationLine: 'line-through',
        opacity: 0.5
    }
});