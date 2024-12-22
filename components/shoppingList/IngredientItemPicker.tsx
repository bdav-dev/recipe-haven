import { StyleSheet, TouchableOpacity, View } from "react-native";
import TextField from "../TextField";
import { equalsIgnoreCase, includesIgnoreCase, isBlank } from "@/utils/StringUtils";
import { useEffect, useState } from "react";
import { Ingredient } from "@/types/IngredientTypes";
import IngredientSuggestion from "../recipe/IngredientSuggestion";
import { isValidAmount, unitToString } from "@/utils/UnitUtils";
import { ThemedText } from "../themed/ThemedText";


type IngredientItemPickerProps = {
    ingredientSuggestions: Ingredient[],
    ingredient?: Ingredient,
    setIngredient: (ingredient?: Ingredient) => void
    amountText: string,
    setAmountText: (text: string) => void,
    initialIngredientText?: string
}

export default function IngredientItemPicker(props: IngredientItemPickerProps) {
    const [ingredientText, setIngredientText] = useState(props.initialIngredientText ?? '');
    const [ingredientSuggestionsVisible, setIngredientSuggestionsVisible] = useState(false);

    useEffect(() => {
        if (props.initialIngredientText)
            setIngredientText(props.initialIngredientText)
    }, [props.initialIngredientText]);

    useEffect(() => {
        props.setIngredient(props.ingredientSuggestions.find(ing => equalsIgnoreCase(ing.name, ingredientText)));
    }, [ingredientText]);

    return (
        <View style={styles.view}>
            <TextField
                placeholder="Zutat"
                style={{ flex: 1 }}
                isErroneous={!isBlank(ingredientText) && props.ingredient == undefined}
                onFocus={() => setIngredientSuggestionsVisible(true)}
                onBlur={() => setIngredientSuggestionsVisible(false)}
                value={ingredientText}
                onChangeText={setIngredientText}
            />
            <View style={[styles.ingredientSuggestionView, { display: ingredientSuggestionsVisible ? "flex" : "none" }]}>
                {
                    props.ingredientSuggestions
                        .filter(() => props.ingredient == undefined)
                        .filter(ing => includesIgnoreCase(ing.name, ingredientText) || includesIgnoreCase(ing.pluralName ?? "", ingredientText))
                        .map(
                            (ingredient, index) =>
                                <TouchableOpacity key={index} onPress={() => setIngredientText(ingredient.name)}>
                                    <IngredientSuggestion key={index} ingredient={ingredient} />
                                </TouchableOpacity>
                        )
                }
            </View>

            <TextField
                placeholder="Menge"
                style={styles.amountTextField}
                keyboardType="numeric"
                readOnly={props.ingredient == undefined}
                value={props.amountText}
                onChangeText={props.setAmountText}
                isErroneous={props.ingredient != undefined && (isBlank(props.amountText) || !isValidAmount(+props.amountText))}
            />
            {
                props.ingredient &&
                <ThemedText>{unitToString(props.ingredient.unit)}</ThemedText>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    view: { flex: 1, marginTop: 6, flexDirection: "row", gap: 6, alignItems: "center" },
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