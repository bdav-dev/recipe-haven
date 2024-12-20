

export function distinctValue(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index;
}

export function startsWithIgnoringCase(a: string, b: string) {
    return a.toLowerCase().startsWith(b.toLowerCase())
}

export function alphabetically(a: string, b: string) {
    return a.localeCompare(b);
}