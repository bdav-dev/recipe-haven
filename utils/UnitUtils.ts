import { Unit } from "@/types/IngredientTypes"

export function unitToString(unit: Unit) {
    switch (+unit) {
        case Unit.GRAMM: return "Gramm"
        case Unit.LITER: return "Liter"
        case Unit.PIECE: return "Stück"
    }
}

export function unitFromValue(unitValue: number) {
    return Object.values(Unit)
        .filter(item => typeof item !== 'string')
        .find(unit => unit.valueOf() === unitValue);
}
