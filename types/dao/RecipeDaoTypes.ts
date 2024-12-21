import { Duration } from "@/data/misc/Duration";
import { QuantizedIngredient } from "../IngredientTypes";
import { Recipe } from "../RecipeTypes";

export type UpdateRecipeBlueprint = {
    originalRecipe: Recipe;
    updatedValues: Omit<Recipe, 'recipeId'>;
}

export type CreateRecipeBlueprint = {
    title: string;
    description?: string;
    difficulty?: number;
    preparationTime?: Duration;
    isFavorite: boolean;
    temporaryImageUri?: string;
    tags: string[];
    ingredientsForOnePortion: QuantizedIngredient[];
}
