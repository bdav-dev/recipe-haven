
type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    kcalPerUnit?: number
}

type QuantizedIngredient = {
    amount?: number,
    ingredient: Ingredient
}

type Recipe = {
    recipeId?: number,
    title: string,
    imageSrc?: string,
    description: string,
    ingredientsForOnePortion: QuantizedIngredient[]
}

type ShoppingList = {
    ingredientItems: ShoppingListIngredientItem[],
    customItems: ShoppingListCustomItem[]
}

type ShoppingListIngredientItem = {
    shoppingListIngredientItemId: number,
    ingredient: QuantizedIngredient
}

type ShoppingListCustomItem = {
    shoppingListCustomItemId: number,
    text: string
}

enum Unit {
    GRAMM,
    LITER,
    PIECE
}
