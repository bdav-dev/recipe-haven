import { Ingredient } from "@/types/IngredientTypes";
import CardView from "../themed/CardView";
import { ThemedText } from "../themed/ThemedText";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { unitToString } from "@/utils/UnitUtils";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/hooks/useAppTheme";
import ThemedBadge from "../themed/ThemedBadge";

type IngredientListItemProps = {
    ingredient: Ingredient
}

export default function IngredientListItem(props: IngredientListItemProps) {
    const ingredient = props.ingredient;
    const theme = useAppTheme();

    return (
        <CardView style={styles.card} noPadding>
            {
                ingredient.imageSrc
                    ? <Image source={{ uri: ingredient.imageSrc }} style={styles.image} />
                    : <View style={{ width: 5 }} />
            }

            <View style={styles.flexColumn}>
                <ThemedText type="largeSemiBold">{ingredient.name}</ThemedText>
                {
                    ingredient.pluralName &&
                    <ThemedText>{props.ingredient.pluralName}</ThemedText>
                }
            </View>

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

            <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil-outline" size={28} color={theme.primary} />
            </TouchableOpacity>

        </CardView>
    );
}

const GAP = 15;

const styles = StyleSheet.create({
    card: {
        height: 75,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: GAP,
        shadowColor: "black",
        shadowOffset: { height: 0, width: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.1,
    },
    image: {
        height: 75,
        width: 75,
        borderRadius: 13,
        padding: 0
    },
    flexColumn: {
        display: "flex",
        flexDirection: "column"
    },
    badges: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP
    },
    editButton: {
        marginLeft: "auto",
        margin: 16
    }
});
