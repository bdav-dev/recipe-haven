
export type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    kcalPerUnit?: number
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
