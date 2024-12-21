
export function djb2(str: string) {
    let hash = 5381;

    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }

    return hash;
}

export function djb2Normalized(str: string) {
    return (djb2(str) >>> 0) / 0xFFFFFFFF;
}
