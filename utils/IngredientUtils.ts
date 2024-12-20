import { QuantizedIngredient } from "@/types/IngredientTypes";


export function quantizedIngredientNameToString(quantizedIngredient: QuantizedIngredient) {
    return quantizedIngredient.amount == 1
        ? quantizedIngredient.ingredient.name
        : quantizedIngredient.ingredient.pluralName ?? quantizedIngredient.ingredient.name;
}