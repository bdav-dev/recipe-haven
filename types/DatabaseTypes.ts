import { Unit } from "./IngredientTypes"

export type DatabaseIngredient = {
    ingredientId: number,
    name: string,
    pluralName?: string,
    imageSrc?: string,
    unit: Unit,
    calorificValueKcal?: number,
    calorificValueNUnits?: number
}

export type DatabaseRecipe = {
    recipeId: number,
    imageSrc?: string,
    title: string,
    description: string,
    difficulty?: number,
    preparationTimeInMinutes?: number,
    isFavorite: number
}

export type FullRecipeQueryResult = DatabaseRecipe & {
    tagnamesJson: string,
    ingredientsMapJson: string
}

export type RecipeIngredientMap = {
    amount: number,
    ingredientId: number
}
