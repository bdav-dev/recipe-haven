import { Ingredient } from "@/types/IngredientTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { unitToString } from "@/utils/UnitUtils";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import ThemedBadge from "../themed/ThemedBadge";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type IngredientListItemProps = {
    ingredient: Ingredient,
    editButton?: { onPress: () => void }
}

export default function IngredientListItem(props: IngredientListItemProps) {
    const ingredient = props.ingredient;
    const theme = useAppTheme();
    const styles = useThemedStyleSheet(createStyles);

    return (
        <CardView style={styles.card} noPadding>
            {
                ingredient.imageSrc
                    ? <Image source={{ uri: ingredient.imageSrc }} style={styles.image} />
                    : <View style={{ width: 5 }} />
            }

            <View style={styles.flexColumn}>

                <ThemedText>
                    <ThemedText type="largeSemiBold">{ingredient.name}</ThemedText>
                    {ingredient.pluralName &&
                        <>
                            <View style={{ width: 8 }} />
                            {props.ingredient.pluralName}
                        </>
                    }
                </ThemedText>

                <View style={styles.badges}>
                    <ThemedBadge>
                        <ThemedText>in </ThemedText>
                        <ThemedText type="defaultSemiBold">{unitToString(ingredient.unit)}</ThemedText>
                    </ThemedBadge>

                    {
                        ingredient.calorificValue &&
                        <ThemedBadge>
                            <ThemedText type="defaultSemiBold">{ingredient.calorificValue.kcal} kcal </ThemedText>
                            <ThemedText>pro </ThemedText>
                            <ThemedText type="defaultSemiBold">{ingredient.calorificValue.nUnits} {unitToString(ingredient.unit)}</ThemedText>
                        </ThemedBadge>
                    }
                </View>

            </View>

            {
                props.editButton &&
                <TouchableOpacity style={styles.editButton} onPress={props.editButton.onPress}>
                    <Ionicons name="pencil-outline" size={28} color={theme.button.default} />
                </TouchableOpacity>
            }
        </CardView>
    );
}

const LIST_ITEM_HEIGHT = 85;
const GAP = 15;

const createStyles = (theme: AppTheme) => StyleSheet.create({
    card: {
        height: LIST_ITEM_HEIGHT,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: GAP,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        borderWidth: theme.ingredientListItem.borderWidth,
        borderColor: theme.border
    },
    image: {
        height: LIST_ITEM_HEIGHT,
        width: LIST_ITEM_HEIGHT,
        borderRadius: 13,
        padding: 0
    },
    flexRow: {
        display: "flex",
        flexDirection: "row",
        gap: 11,
        backgroundColor: "red"
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        gap: 8
    },
    badges: {
        display: "flex",
        flexDirection: "row",
        gap: 6
    },
    editButton: {
        marginLeft: "auto",
        margin: 16
    }
});
