export class Time {
    public hour: number;
    public minute: number;
    public second: number;
    public milisecond: number;

    constructor(hour: number = 0, minute: number = 0, second: number = 0, milisecond: number = 0) {
        this.hour = hour;
        this.minute = minute;
        this.second = second;
        this.milisecond = milisecond;
    }

    public zeroPaddingString(base: number): string {
        let base_string = base.toString();
        if (base <= 0) return "00";
        else if (base > 0 && base < 10) return "0" + base_string;
        else return base_string;
    }

    public static zeroPaddingString(base: number): string {
        let base_string = base.toString();
        if (base <= 0) return "00";
        else if (base > 0 && base < 10) return "0" + base_string;
        else return base_string;
    }

    public static fromDate(date: Date): Time {
        return new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }
}