import { CalorificValue, Ingredient, Unit } from "../IngredientTypes"

export type CreateIngredientBlueprint = {
    name: string,
    pluralName?: string,
    temporaryImageUri?: string,
    unit: Unit,
    calorificValue?: CalorificValue
}

export type UpdateIngredientBlueprint = {
    originalIngredient: Ingredient
    updatedValues: Omit<Ingredient, 'ingredientId'>
}