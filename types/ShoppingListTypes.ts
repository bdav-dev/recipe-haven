import { QuantizedIngredient } from "./IngredientTypes"

export type ShoppingList = {
    ingredientItems: ShoppingListIngredientItem[],
    customItems: ShoppingListCustomItem[]
}

export type ShoppingListIngredientItem = {
    shoppingListIngredientItemId: number,
    ingredient: QuantizedIngredient
}

export type ShoppingListCustomItem = {
    shoppingListCustomItemId: number,
    text: string
}
