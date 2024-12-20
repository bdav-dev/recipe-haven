import { RecipeDifficulty } from "@/types/RecipeTypes"


export function difficultyToString(difficulty?: RecipeDifficulty) {
    const defaultCase = "";

    if(difficulty == undefined) {
        return defaultCase;
    }

    switch (+difficulty) {
        case RecipeDifficulty.DIFFICULT: return "Schwer"
        case RecipeDifficulty.MEDIUM: return "Mittelschwer"
        case RecipeDifficulty.EASY: return "Leicht"
        default: return defaultCase
    }
}

export function difficultyToColor(difficulty: RecipeDifficulty) {
    switch (+difficulty) {
        case RecipeDifficulty.DIFFICULT: return "#ef4444"
        case RecipeDifficulty.MEDIUM: return "#fbbf24"
        case RecipeDifficulty.EASY: return "#4ade80"
        default: return ""
    }
}
