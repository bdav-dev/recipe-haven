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

export type DatabaseShoppingListItemBase = {
    isChecked: boolean
    creationTimestamp: Date
}

export type DatabaseShoppingListIngredientItem = DatabaseShoppingListItemBase & {
    shoppingListIngredientItemId: number,
    ingredientId: number,
    amount?: number
}

export type DatabaseShoppingListCustomItem = DatabaseShoppingListItemBase & {
    shoppingListCustomItemId: number,
    text: string
}