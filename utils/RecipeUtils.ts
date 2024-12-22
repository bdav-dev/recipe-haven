import { QuantizedIngredient } from "@/types/IngredientTypes";
import { Recipe } from "@/types/RecipeTypes";

export function getTotalKcalPerPortion(ingredients: QuantizedIngredient[]) {
    if (ingredients.length == 0) {
        return undefined;
    }

    return ingredients
        .map(quantizedIngredient => {
            const amount = quantizedIngredient.amount;
            const ingredient = quantizedIngredient.ingredient;

            if (!ingredient.calorificValue) {
                return undefined;
            }

            return (ingredient.calorificValue.kcal / ingredient.calorificValue.nUnits) * amount;
        })
        .reduce(
            (acc, val) => (
                acc == undefined || val == undefined
                    ? undefined
                    : acc + val
            ),
            0
        );
}