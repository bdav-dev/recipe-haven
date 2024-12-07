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

export interface ShoppingListIngredientItem {
    shoppingListIngredientItemId: number;
    ingredient: QuantizedIngredient;
    isChecked: boolean;
    creationTimestamp: Date;
    isAggregated?: boolean;
}

export type ShoppingListCustomItem = ShoppingListItemBase & {
    shoppingListCustomItemId: number,
    text: string
}
