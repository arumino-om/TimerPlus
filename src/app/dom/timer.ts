import { Time } from "../types/time";

export class TimerDOM {
    public static setTime(time: Time) {
        let timer = document.getElementById("timer");
        let timer_milisecond = document.getElementById("timerMilisecond");
        timer!.textContent = `${time.zeroPaddingString(time.hour)}:${time.zeroPaddingString(time.minute)}:${time.zeroPaddingString(time.second)}`;
        timer_milisecond!.textContent = `.${time.zeroPaddingString(time.milisecond)}`;
    }

    public static setTimeFromRaw(hour: number, minute: number, second: number, milisecond: number) {
        let timer = document.getElementById("timer");
        let timer_milisecond = document.getElementById("timerMilisecond");
        timer!.textContent = `${Time.zeroPaddingString(hour)}:${Time.zeroPaddingString(minute)}:${Time.zeroPaddingString(second)}`;
        timer_milisecond!.textContent = `.${Time.zeroPaddingString(milisecond)}`;
    }

    public static setTimerDescription(text: string) {
        let timer_description = document.getElementById("timerDescription");
        timer_description!.textContent = text;
    }
}