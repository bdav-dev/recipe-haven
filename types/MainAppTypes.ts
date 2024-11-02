import { CalorificValue } from "./OtherTypes"

export type IngredientBlueprint = {
    name: string,
    pluralName?: string,
    temporaryImageUri?: string,
    unit: Unit,
    calorificValue?: CalorificValue
}

export type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValue?: CalorificValue
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

export type QuantizedIngredient = {
    amount?: number,
    ingredient: Ingredient
}

export type Recipe = {
    recipeId?: number,
    title: string,
    imageSrc?: string,
    description: string,
    ingredientsForOnePortion: QuantizedIngredient[]
}

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

export enum Unit {
    GRAMM,
    LITER,
    PIECE
}


export function unitToString(unit: Unit) {
    switch (+unit) {
        case Unit.GRAMM: return "Gramm"
        case Unit.LITER: return "Liter"
        case Unit.PIECE: return "Stück"
    }
}
