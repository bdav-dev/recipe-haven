import { Ingredient } from "@/types/IngredientTypes";
import CardView from "../themed/CardView";
import { StyleSheet, View } from "react-native";
import { Image } from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { AppTheme } from "@/types/ThemeTypes";
import { useThemedStyleSheet } from "@/hooks/useThemedStyleSheet";

type IngredientSuggestionProps = {
    ingredient: Ingredient
}

export default function IngredientSuggestion(props: IngredientSuggestionProps) {
    const styles = useThemedStyleSheet(createStyles);

    const MAX_NAME_LENGTH = 20;
    const ingredientName = (
        props.ingredient.name.length > MAX_NAME_LENGTH
            ? props.ingredient.name.slice(0, MAX_NAME_LENGTH - 3) + "..."
            : props.ingredient.name
    );

    return (
        <CardView style={styles.cardView} noPadding>
            {
                props.ingredient.imageSrc
                    ? <Image source={{ uri: props.ingredient.imageSrc }} style={styles.image} />
                    : <View style={{ width: 3 }} />
            }
            <ThemedText style={styles.text}>{ingredientName}</ThemedText>
        </CardView>
    );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
    cardView: {
        borderWidth: 1,
        padding: 2,
        borderColor: theme.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        borderRadius: 999
    },
    image: {
        width: 25,
        height: 25,
        borderRadius: 999
    },
    text: {
        marginRight: 6
    }
});