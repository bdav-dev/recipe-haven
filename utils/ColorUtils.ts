
export function hsvToRgb(hueAngle: number, saturation: number, value: number) {
    const f = (n: number, k = (n + hueAngle / 60) % 6) => value - value * saturation * Math.max(Math.min(k, 4 - k, 1), 0);
    return {
        red: f(5),
        green: f(3),
        blue: f(1)
    }
}

export function hsvToColor(hueAngle: number, saturation: number, value: number) {
    const { red, green, blue } = hsvToRgb(hueAngle, saturation, value);
    return `rgb(${red * 255}, ${green * 255}, ${blue * 255})`;
}
