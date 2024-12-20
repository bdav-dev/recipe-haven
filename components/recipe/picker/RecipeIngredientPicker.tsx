import TextField from "@/components/TextField";
import { Ingredient, QuantizedIngredient } from "@/types/IngredientTypes";
import { equalsIgnoreCase, includesIgnoreCase, isBlank } from "@/utils/StringUtils";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IngredientSuggestion from "../IngredientSuggestion";
import { ThemedText } from "@/components/themed/ThemedText";
import { isValidAmount, unitToString } from "@/utils/UnitUtils";
import Button from "@/components/Button";


type RecipeIngredientPickerProps = {
    ingredientSuggestions: Ingredient[],
    recipeIngredients: QuantizedIngredient[],
    onIngredientAdd: (recipeIngredient: QuantizedIngredient) => void
    onIngredientAmountAdd: (recipeIngredient: QuantizedIngredient, amount: number) => void
}

export default function RecipeIngredientPicker(props: RecipeIngredientPickerProps) {
    const [ingredientSuggestionsVisible, setIngredientSuggestionsVisible] = useState(false);
    const [ingredientText, setIngredientText] = useState('');
    const [amountText, setAmountText] = useState('');

    useEffect(() => {
        setIngredient(props.ingredientSuggestions.find(ing => equalsIgnoreCase(ing.name, ingredientText)));
    }, [ingredientText]);

    const [ingredient, setIngredient] = useState<Ingredient>();


    function addRecipeIngredient() {
        const amount = +amountText;
        if (!isValidAmount(amount) || ingredient == undefined) {
            return;
        }

        const recipeIngredient = props.recipeIngredients.find(ing => ing.ingredient.ingredientId == ingredient.ingredientId);

        if (recipeIngredient) {
            props.onIngredientAmountAdd(recipeIngredient, amount);
        } else {
            props.onIngredientAdd({ ingredient, amount })
        }

        setIngredientText('');
        setAmountText('');
    }

    return (
        <View style={styles.recipeIngredientPicker}>

            <View style={{ flex: 1 }}>
                <TextField
                    placeholder="Zutat"
                    isErroneous={!isBlank(ingredientText) && ingredient == undefined}
                    onFocus={() => setIngredientSuggestionsVisible(true)}
                    onBlur={() => setIngredientSuggestionsVisible(false)}
                    value={ingredientText}
                    onChangeText={setIngredientText}
                />
                <View style={[styles.ingredientSuggestionView, { display: ingredientSuggestionsVisible ? "flex" : "none" }]}>
                    {
                        props.ingredientSuggestions
                            .filter(() => ingredient == undefined)
                            .filter(ing => includesIgnoreCase(ing.name, ingredientText) || includesIgnoreCase(ing.pluralName ?? "", ingredientText))
                            .map(
                                (ingredient, index) =>
                                    <TouchableOpacity key={index} onPress={() => setIngredientText(ingredient.name)}>
                                        <IngredientSuggestion key={index} ingredient={ingredient} />
                                    </TouchableOpacity>
                            )
                    }
                </View>
            </View>

            <TextField
                placeholder="Menge"
                style={styles.amountTextField}
                keyboardType="numeric"
                readOnly={ingredient == undefined}
                value={amountText}
                onChangeText={setAmountText}
                isErroneous={ingredient != undefined && (isBlank(amountText) || !isValidAmount(+amountText))}
            />
            {
                ingredient &&
                <ThemedText>{unitToString(ingredient.unit)}</ThemedText>
            }
            <Button ionicon="add-outline" onPress={addRecipeIngredient} />
        </View>
    );
}


const styles = StyleSheet.create({
    ingredientSuggestionView: {
        position: "absolute",
        bottom: 38,
        width: "100%",
        overflow: "hidden",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 3
    },
    amountTextField: {
        minWidth: 80,
        textAlign: "center"
    },
    recipeIngredientPicker: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center"
    }
});