import { Recipe } from "@/types/RecipeTypes";

export function getTotalKcalPerPortion(recipe: Recipe) {
    return recipe.ingredientsForOnePortion
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
