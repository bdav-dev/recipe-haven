import { isBlank } from "./StringUtils";

export function toNumber(string: string): number {
    if (isBlank(string)) {
        return Number.NaN;
    }

    return +(string.replace(',', '.'));
}

export function isPositiveInteger(value: number) {
    return Number.isInteger(value)
        ? value > 0
        : false;
}

export function isPositiveIntegerOrZero(value: number) {
    return Number.isInteger(value)
        ? value >= 0
        : false;
}