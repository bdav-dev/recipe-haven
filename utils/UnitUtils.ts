import { QuantizedIngredient, Unit } from "@/types/IngredientTypes"
import { quantizedIngredientNameToString } from "./IngredientUtils";

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
    const result = unitToConvertedStringAsObject(amount, unit);
    return result.amount + ' ' + result.unit;
}

export function isValidAmount(amount: number) {
    if (isNaN(amount)) {
        return false;
    }

    return amount > 0;
}

export function unitToConvertedStringAsObject(amount: number, unit: Unit) {
    let unitText: string = '';
    let adjustedAmount = amount;

    switch (+unit) {
        case Unit.GRAMM:
            if (amount >= 1000) {
                adjustedAmount = (amount / 1000);
                unitText = "kg";
            } else {
                unitText = "g";
            }
            break;
        case Unit.LITER:
            if (amount < 1) {
                adjustedAmount = amount * 1000;
                unitText = "ml";
            } else {
                unitText = "l";
            }
            break;
    }

    return {
        unit: unitText,
        amount: (Number.isInteger(adjustedAmount) ? adjustedAmount.toString() : adjustedAmount.toFixed(1))
    }
}

export function getQuantizedIngredientFrontendText(quantizedIngredient: QuantizedIngredient) {
    const result = unitToConvertedStringAsObject(quantizedIngredient.amount, quantizedIngredient.ingredient.unit);
    return {
        ...result,
        displayName: quantizedIngredientNameToString(quantizedIngredient)
    }
}