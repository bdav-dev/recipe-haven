import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";
import { ShoppingListIngredientItem } from "@/types/ShoppingListTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { unitToConvertedString } from "@/utils/UnitUtils";
import { quantizedIngredientNameToString } from "@/utils/IngredientUtils";

type IngredientShoppingListItemProps = {
    item: ShoppingListIngredientItem;
    onToggleCheck: (item: ShoppingListIngredientItem) => void;
    editButton?: { onPress: () => void };
}

export default function IngredientShoppingListItem(props: IngredientShoppingListItemProps) {
    const { item, onToggleCheck, editButton } = props;
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    const getDisplayName = () => {
        const amount = item.ingredient.amount;
        const unit = item.ingredient.ingredient.unit;
        const ingredient = item.ingredient.ingredient;

        // Get name based on amount
        const name = amount === 1 ? ingredient.name : (ingredient.pluralName || ingredient.name);

        return `${amount} ${name}`;
    };

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
                    style={[item.isChecked && styles.checkedText]}
                >
                    {unitToConvertedString(item.ingredient.amount, item.ingredient.ingredient.unit)} {quantizedIngredientNameToString(item.ingredient)}
                </ThemedText>
            </View>

            {
                item.ingredient.ingredient.imageSrc &&
                <Image
                    source={{ uri: item.ingredient.ingredient.imageSrc }}
                    style={styles.image}
                />
            }

            <View style={{ flex: 1 }} />

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
    image: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8
    },
    contentContainer: {
        marginRight: 16,
        justifyContent: 'center'
    },
    amount: {
        fontSize: 12,
        opacity: 0.7
    },
    checkedText: {
        textDecorationLine: 'line-through',
        opacity: 0.5
    }
});
