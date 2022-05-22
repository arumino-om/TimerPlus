import { Time } from "./types/time";

export class InputHelper {
    public static init() {
        let input_number = <NodeListOf<HTMLInputElement>>document.querySelectorAll("input[type='number']");
        input_number.forEach((item) => {
            item.addEventListener("change", () => {
                if (parseInt(item.value) > parseInt(item.max)) item.value = item.max;
                if (parseInt(item.value) < parseInt(item.min)) item.value = item.min;
                if (item.value == "") item.value = item.min;
            });
        });
    }

    public static getTimeFromTimeGroup(timegroup: string): Time {
        let hour = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='hour']`)!;
        let minute = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='minute']`)!;
        let second = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='second']`)!;

        return new Time(parseInt(hour.value), parseInt(minute.value), parseInt(second.value), 0);
    }

    public static setTimeToTimeGroup(timegroup: string, time: Time) {
        let hour = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='hour']`)!;
        let minute = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='minute']`)!;
        let second = <HTMLInputElement>document.querySelector(`[data-timegroup='${timegroup}'][data-timekind='second']`)!;

        hour.value = time.hour.toString();
        minute.value = time.minute.toString();
        second.value = time.second.toString();
    }
}