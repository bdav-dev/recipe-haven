import TextField from "@/components/TextField";
import CardView from "@/components/themed/CardView";
import { ThemedText } from "@/components/themed/ThemedText";
import { FrontendRecipeHolderContext } from "@/context/EditRecipeContextProvider";
import { IngredientContext } from "@/context/IngredientContextProvider";
import { isPositiveInteger } from "@/utils/MathUtils";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { QuantizedIngredient } from "@/types/IngredientTypes";
import { moveArrayItem } from "@/utils/ArrayUtils";
import RecipeIngredientList from "../RecipeIngredientList";
import RecipeIngredientPicker from "../picker/RecipeIngredientPicker";
import { CREATE_EDIT_RECIPE_MODAL_COMMON_STYLES } from "@/styles/CommonStyles";

export default function SecondStage() {
    const { states } = useContext(FrontendRecipeHolderContext);
    const { ingredients: ingredientSuggestions } = useContext(IngredientContext);

    const [amountOfPortionsText, setAmountOfPortionsText] = useState('1');

    function moveRecipeIngredientUp(index: number) {
        states.ingredients.set(recipeIngredient => {
            moveArrayItem(recipeIngredient, index, index - 1);
            return [...recipeIngredient];
        });
    }

    function moveRecipeIngredientDown(index: number) {
        states.ingredients.set(recipeIngredient => {
            moveArrayItem(recipeIngredient, index, index + 1);
            return [...recipeIngredient];
        });
    }

    function removeRecipeIngredient(recipeIngredient: QuantizedIngredient) {
        states.ingredients.set(rIngs => rIngs.filter(rIng => rIng != recipeIngredient));
    }

    function addRecipeIngredient(recipeIngredient: QuantizedIngredient) {
        states.ingredients.set(recipeIngredients => [...recipeIngredients, recipeIngredient]);
    }

    function changeRecipeIngredientAmount(recipeIngredient: QuantizedIngredient, amount: number) {
        recipeIngredient.amount += amount;
        states.ingredients.set(recipeIngredients => [...recipeIngredients]);
    }

    return (
        <View style={CREATE_EDIT_RECIPE_MODAL_COMMON_STYLES.stage}>

            <CardView style={styles.amountOfPortionsView}>
                <ThemedText>Zutaten für </ThemedText>
                <TextField
                    style={styles.amountOfPortionsTextField}
                    keyboardType="numeric"
                    value={amountOfPortionsText}
                    onChangeText={setAmountOfPortionsText}
                    isErroneous={!isPositiveInteger(+amountOfPortionsText)}
                />
                <ThemedText> Portion(en)</ThemedText>
            </CardView>

            <CardView title="Zutat hinzufügen">
                <RecipeIngredientPicker
                    style={styles.recipeIngredientPicker}
                    ingredientSuggestions={ingredientSuggestions}
                    recipeIngredients={states.ingredients.value}
                    onIngredientAdd={addRecipeIngredient}
                    onIngredientAmountAdd={changeRecipeIngredientAmount}
                />
            </CardView>

            <CardView title="Zutaten">
                <RecipeIngredientList
                    recipeIngredients={states.ingredients.value}
                    onMoveUp={moveRecipeIngredientUp}
                    onMoveDown={moveRecipeIngredientDown}
                    onDelete={removeRecipeIngredient}
                />
            </CardView>

        </View>
    );
}

const styles = StyleSheet.create({
    amountOfPortionsView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    amountOfPortionsTextField: {
        minWidth: 50,
        textAlign: "center"
    },
    recipeIngredientPicker: {
        marginTop: 4
    }
});