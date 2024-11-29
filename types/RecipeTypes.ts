import { Duration } from "@/data/misc/Duration"
import { QuantizedIngredient } from "./IngredientTypes"

export type Recipe = {
    recipeId: number,
    imageSrc?: string,
    title: string,
    description: string,
    ingredientsForOnePortion: QuantizedIngredient[],
    isFavorite: boolean,
    preparationTime?: Duration,
    difficulty?: RecipeDifficulty,
    tags: string[]
}

export enum RecipeDifficulty {
    EASY,
    MEDIUM,
    DIFFICULT
}
