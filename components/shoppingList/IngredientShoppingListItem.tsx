import { StyleSheet, View, TouchableOpacity } from "react-native";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { ShoppingListIngredientItem } from "@/types/ShoppingListTypes";
import { unitToString } from "@/utils/UnitUtils";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";

type IngredientShoppingListItemProps = {
    item: ShoppingListIngredientItem;
    onToggleCheck?: (item: ShoppingListIngredientItem) => void;
    editButton?: {
        onPress: () => void;
    };
}

export default function IngredientShoppingListItem(props: IngredientShoppingListItemProps) {
    const theme = useAppTheme();

    return (
        <CardView>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => props.onToggleCheck?.(props.item)}>
                    <Ionicons 
                        name={props.item.isChecked ? "checkbox" : "square-outline"} 
                        size={24} 
                        color={theme.button.default}
                    />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                    <ThemedText type="largeSemiBold">
                        {props.item.quantity} {unitToString(props.item.ingredient.measurementUnit)} {props.item.ingredient.name}
                    </ThemedText>
                </View>
                {props.editButton && (
                    <TouchableOpacity onPress={props.editButton.onPress}>
                        <Ionicons name="pencil-outline" size={24} color={theme.button.default} />
                    </TouchableOpacity>
                )}
            </View>
        </CardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        gap: 12
    },
    textContainer: {
        flex: 1
    }
});
