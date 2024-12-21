


export function moveArrayItem(array: unknown[], fromIndex: number, toIndex: number) {
    const element = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, element);
}

export function isLastIndex(index: number, array: unknown[]) {
    return index == array.length - 1;
}

export function isLastElement<T>(element: T, array: T[]) {
    return isLastIndex(array.indexOf(element), array);
}

export function lastElement<T>(array: T[]): T | undefined {
    if (array.length == 0) {
        return undefined;
    }
    return array[array.length - 1];
}