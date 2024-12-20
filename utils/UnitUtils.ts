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

export function unitToConvertedString(amount: number, unit: Unit) {
    switch (+unit) {
        case Unit.GRAMM:
            return amount >= 1000
                ? (amount / 1000) + "kg"
                : amount + "g";
        case Unit.LITER:
            return amount < 1
                ? (amount * 1000) + "ml"
                : amount + "l";
        default:
            return amount + "";
    }
}

export function isValidAmount(amount: number) {
    if (isNaN(amount)) {
        return false;
    }

    return amount > 0;
}