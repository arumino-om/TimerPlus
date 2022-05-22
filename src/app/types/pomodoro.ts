import { Time } from "./time";

export class Pomodoro {
    public pomodoros: number;
    public pomodoro_time: Time;
    public pomodoro_shortsleep_time: Time;
    public pomodoro_longsleep_time: Time;

    public now_pomodoro: number = 0;
    public is_sleep: boolean = false;

    constructor(pomodoros: number, pomodoro_time: Time, pomodoro_shortsleep_time: Time, pomodoro_longsleep_time: Time) {
        this.pomodoros = pomodoros;
        this.pomodoro_time = pomodoro_time;
        this.pomodoro_shortsleep_time = pomodoro_shortsleep_time;
        this.pomodoro_longsleep_time = pomodoro_longsleep_time;
    }
}