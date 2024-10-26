

type Recipe = {
    recipeId?: number,
    title: string,
    imageSrc?: string,
    description: string,
    ingredientsForOnePortion: QuantizedIngredient[]
}

type QuantizedIngredient = {
    amount: number,
    ingredient: Ingredient
}

type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    kcalPerUnit?: number
}

enum Unit {
    GRAMM,
    LITER,
    PIECE
}