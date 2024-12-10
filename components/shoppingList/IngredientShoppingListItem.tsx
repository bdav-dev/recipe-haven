import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ShoppingListIngredientItem } from "@/types/ShoppingListTypes";

type IngredientShoppingListItemProps = {
    item: ShoppingListIngredientItem,
    onToggleCheck: (item: ShoppingListIngredientItem) => void,
    editButton?: { onPress: () => void }
}

export default function IngredientShoppingListItem(props: IngredientShoppingListItemProps) {
    const { item, onToggleCheck, editButton } = props;
    const theme = useAppTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => onToggleCheck(item)}>
                <Ionicons
                    name={item.isChecked ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color={theme.text}
                />
            </TouchableOpacity>
            <Image source={{ uri: item.ingredient.ingredient.imageSrc }} style={styles.image} />
            <View style={styles.textContainer}>
                <ThemedText type="largeSemiBold">{item.ingredient.ingredient.name}</ThemedText>
                {item.ingredient.ingredient.pluralName && (
                    <ThemedText>{item.ingredient.ingredient.pluralName}</ThemedText>
                )}
            </View>
            <ThemedText>{item.ingredient.amount} {item.ingredient.ingredient.unit}</ThemedText>
            {editButton && (
                <TouchableOpacity onPress={editButton.onPress}>
                    <Ionicons name="pencil-outline" size={24} color={theme.button.default} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginBottom: 10
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10
    },
    textContainer: {
        flex: 1,
        marginRight: 10
    }
});
