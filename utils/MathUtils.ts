
export function toNumber(string: string): number | undefined {
    const number = +(string.replace(',', '.'));
    return isNaN(number) ? undefined : number;
}

export function isNumeric(string: string) {
    return toNumber(string) != undefined;
}

export function isInteger(string: string) {
    const number = toNumber(string);
    if (number == undefined) {
        return false;
    }
    return Number.isInteger(number);
}

