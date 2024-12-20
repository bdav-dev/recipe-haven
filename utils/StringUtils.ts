
export function isBlank(string: string) {
    return (!string || /^\s*$/.test(string));
}

export function isNumeric(string: string) {
    return !isNaN(+string);
}

export function includesIgnoreCase(string: string, keyword: string) {
    return string.toLowerCase().includes(keyword.toLowerCase());
}

export function equalsIgnoreCase(a: string, b: string) {
    return a.toLowerCase() == b.toLowerCase();
}
