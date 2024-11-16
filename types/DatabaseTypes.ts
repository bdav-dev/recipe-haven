import { Unit } from "./IngredientTypes"

export type DatabaseIngredient = {
    ingredientId: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValueKcal?: number,
    calorificValueNUnits?: number
}


export type DatabaseShoppingListIngredientItem = {
    shoppingListIngredientItemId: number,
    ingredientId: number,
    amount?: number
}

export type DatabaseShoppingListCustomItem = {
    shoppingListCustomItemId: number,
    text: string
}