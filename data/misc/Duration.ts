
export class Duration {
    private durationInMinutes: number;

    private constructor(durationInMinutes: number) {
        this.durationInMinutes = durationInMinutes
    }

    public static ofMinutes(minutes: number) {
        return new Duration(minutes);
    }

    public static ofHoursAndMinutes(hours: number, minutes: number) {
        return new Duration(hours * 60 + minutes);
    }

    public toString() {
        const { hours, minutes } = this.asHoursAndMinutes();

        if (hours == 0 && minutes == 0) {
            return "0min";
        }

        return [(hours != 0 ? `${hours}h` : ''), (minutes != 0 ? `${minutes}min` : '')].join(" ");
    }

    public asMinutes() {
        return this.durationInMinutes;
    }

    public asHoursAndMinutes() {
        return {
            hours: Math.floor(this.durationInMinutes / 60),
            minutes: this.durationInMinutes % 60
        }
    }

}
