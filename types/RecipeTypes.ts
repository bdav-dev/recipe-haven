import { QuantizedIngredient } from "./IngredientTypes"

export type Recipe = {
    recipeId?: number,
    title: string,
    imageSrc?: string,
    description: string,
    ingredientsForOnePortion: QuantizedIngredient[]
}