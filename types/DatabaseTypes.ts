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
