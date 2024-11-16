import { QuantizedIngredient } from "./IngredientTypes"

type ShoppingListItemBase = {
    isChecked: boolean
    creationTimestamp: Date
}

export type ShoppingList = {
    ingredientItems: ShoppingListIngredientItem[],
    customItems: ShoppingListCustomItem[]
}

export type ShoppingListIngredientItem = ShoppingListItemBase & {
    shoppingListIngredientItemId: number,
    ingredient: QuantizedIngredient
}

export type ShoppingListCustomItem = ShoppingListItemBase & {
    shoppingListCustomItemId: number,
    text: string
}
