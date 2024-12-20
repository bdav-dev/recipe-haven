import { QuantizedIngredient } from "@/types/IngredientTypes";
import { StyleSheet, View } from "react-native";
import RecipeIngredientListItem from "./RecipeIngredientListItem";
import { isLastElement, isLastIndex } from "@/utils/ArrayUtils";
import { ThemedText } from "../themed/ThemedText";

type RecipeIngredientListProps = {
    recipeIngredients: QuantizedIngredient[]
    onMoveUp: (index: number) => void,
    onMoveDown: (index: number) => void,
    onDelete: (recipeIngredient: QuantizedIngredient) => void
}

export default function RecipeIngredientList(props: RecipeIngredientListProps) {

    function onMoveUp(recipeIngredient: QuantizedIngredient) {
        const index = props.recipeIngredients.findIndex(rIng => rIng == recipeIngredient);

        if (index == 0) {
            return;
        }

        props.onMoveUp(index);
    }

    function onMoveDown(recipeIngredient: QuantizedIngredient) {
        const index = props.recipeIngredients.indexOf(recipeIngredient);

        if (isLastIndex(index, props.recipeIngredients)) {
            return;
        }

        props.onMoveDown(index);
    }

    const isLast = (recipeIngredient: QuantizedIngredient) => isLastElement(recipeIngredient, props.recipeIngredients);
    const isFirst = (recipeIngredient: QuantizedIngredient) => props.recipeIngredients.indexOf(recipeIngredient) == 0;

    return (
        <View style={styles.list}>
            {
                props.recipeIngredients.length != 0
                    ? props.recipeIngredients
                        .map(
                            (recipeIngredient, index) => (
                                <RecipeIngredientListItem
                                    key={index}
                                    recipeIngredient={recipeIngredient}
                                    control={
                                        {
                                            onDelete: props.onDelete,
                                            onMoveDown: isLast(recipeIngredient) ? undefined : onMoveDown,
                                            onMoveUp: isFirst(recipeIngredient) ? undefined : onMoveUp
                                        }
                                    }
                                />
                            )
                        )
                    : <ThemedText style={styles.noIngredientsText}>Keine Zutaten</ThemedText>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        flexDirection: "column"
    },
    noIngredientsText: {
        flex: 1,
        textAlign: "center"
    }
});