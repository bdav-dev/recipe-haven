export type Ingredient = {
    ingredientId?: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValue?: CalorificValue
}

export type QuantizedIngredient = {
    amount?: number,
    ingredient: Ingredient
}

export enum Unit {
    GRAMM,
    LITER,
    PIECE
}

export type CalorificValue = {
    kcal: number,
    nUnits: number
}
