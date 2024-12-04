import { QuantizedIngredient } from "./IngredientTypes"

// Base type for all shopping list items
type ShoppingListItemBase = {
    isChecked: boolean
    creationTimestamp: Date
}

export type ShoppingList = {
    ingredientItems: ShoppingListIngredientItem[],
    customItems: ShoppingListCustomItem[]
    // Placeholder for future implementation
    // recipeItems: ShoppingListRecipeItem[]
}

export type ShoppingListIngredientItem = ShoppingListItemBase & {
    shoppingListIngredientItemId: number,
    ingredient: QuantizedIngredient
}

export type ShoppingListCustomItem = ShoppingListItemBase & {
    shoppingListCustomItemId: number,
    text: string
}
