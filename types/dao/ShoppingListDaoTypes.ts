
import { QuantizedIngredient } from "../IngredientTypes"
import { ShoppingListCustomItem, ShoppingListIngredientItem } from "../ShoppingListTypes"

export type CreateShoppingListIngredientItemBlueprint = {
    ingredient: QuantizedIngredient
}

export type UpdateShoppingListIngredientItemBlueprint = {
    originalItem: ShoppingListIngredientItem,
    updatedValues: Omit<ShoppingListIngredientItem, 'shoppingListIngredientItemId'>
}

export type CreateShoppingListCustomItemBlueprint = {
    text: string
}

export type UpdateShoppingListCustomItemBlueprint = {
    originalItem: ShoppingListCustomItem,
    updatedValues: Omit<ShoppingListCustomItem, 'shoppingListCustomItemId'>
}