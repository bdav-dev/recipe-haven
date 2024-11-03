import { CalorificValue, Unit } from "./MiscellaneousTypes"

export type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValue?: CalorificValue
}

export type QuantizedIngredient = {
    amount?: number,
    ingredient: Ingredient
}

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

export type DatabaseIngredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValueKcal?: number,
    calorificValueNUnits?: number
}






