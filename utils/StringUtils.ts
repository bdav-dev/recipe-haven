
export function isBlank(string: string) {
    return (!string || /^\s*$/.test(string));
}

export function isNumeric(string: string) {
    return !isNaN(+string);
}
