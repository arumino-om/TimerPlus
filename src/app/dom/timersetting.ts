import { InputHelper } from "../input_helper";
import { TimerManager } from "../manager/timer";
import { Time } from "../types/time";
import { TimerDOM } from "./timer";
import { Storage } from "../manager/storage";

export class TimerSettingDOM {
    private static show_timersetting_view: string = "";

    public static init() {
        let timer_select = <HTMLSelectElement>document.getElementById("timerKinds");
        timer_select.addEventListener("change", () => this.changeTimerSettingView(timer_select.value));

        // コンテナのオブザーバー
        const element = document.getElementById('timerSetting');
        let observer = new MutationObserver(() => {
            if (!element?.classList.contains("is-show")) this.CloseTimerSettingEvent(); //閉じられた時
            else this.changeTimerSettingView(timer_select.value); //表示された時
        });
        const config = { attributes: true };
        observer.observe(<Node>element, config);

        this.resumeSettingsFromLocalStorage();
    }

    public static getPomodoros(): number {
        let pomodoros = <HTMLInputElement>document.getElementById("pomodoros")!;
        return parseInt(pomodoros.value);
    }

    public static getWorkbgmTransparency(): number {
        let workbgm_transparency = <HTMLInputElement>document.getElementById("workbgm-transparency")!;
        return parseInt(workbgm_transparency.value);
    }

    public static getWorkbgmBlur(): number {
        let workbgm_blur = <HTMLInputElement>document.getElementById("workbgm-blur")!;
        return parseInt(workbgm_blur.value);
    }

    public static getFinishSound() {
        let finish_sound_element = <HTMLInputElement>document.getElementById("timer-finish-sound");
        return finish_sound_element.value;
    }

    private static changeTimerSettingView(value: string) {
        let active_timer_setting = document.querySelector(".timer-setting.is-show");
        active_timer_setting?.classList.remove("is-show");
        let request_timer_setting = document.querySelector(`.timer-setting[data-timer='${value}']`);
        request_timer_setting?.classList.add("is-show");
    }

    private static CloseTimerSettingEvent() {
        let active_timer_setting = document.querySelector(".timer-setting.is-show");
        TimerManager.updateInitialTimer(active_timer_setting!.getAttribute("data-timer")!);
        active_timer_setting?.classList.remove("is-show");
        this.saveSettingsToLocalStorage();
    }

    private static saveSettingsToLocalStorage() {
        Storage.saveTime("timer", InputHelper.getTimeFromTimeGroup("timer"));
        Storage.saveTime("pomodoro-time", InputHelper.getTimeFromTimeGroup("pomodoro-time"));
        Storage.saveTime("pomodoro-shortsleep-time", InputHelper.getTimeFromTimeGroup("pomodoro-shortsleep-time"));
        Storage.saveTime("pomodoro-longsleep-time", InputHelper.getTimeFromTimeGroup("pomodoro-longsleep-time"));

        let selected_timerkind = <HTMLInputElement>document.getElementById("timerKinds")!;
        localStorage.setItem("pomodoros", this.getPomodoros().toString());
        localStorage.setItem("timer-kind", selected_timerkind.value);
        localStorage.setItem("workbgm-transparency", this.getWorkbgmTransparency().toString());
        localStorage.setItem("workbgm-blur", this.getWorkbgmBlur().toString());
        localStorage.setItem("timer-finish-sound", this.getFinishSound());
    }

    private static resumeSettingsFromLocalStorage() {
        this.SetTimeGroupValueSafe("timer");
        this.SetTimeGroupValueSafe("pomodoro-time");
        this.SetTimeGroupValueSafe("pomodoro-shortsleep-time");
        this.SetTimeGroupValueSafe("pomodoro-longsleep-time");

        this.setInputValueSafe("pomodoros", localStorage.getItem("pomodoros"));
        this.setInputValueSafe("timerKinds", localStorage.getItem("timer-kind"));
        this.setInputValueSafe("workbgm-transparency", localStorage.getItem("workbgm-transparency"));
        this.setInputValueSafe("workbgm-blur", localStorage.getItem("workbgm-blur"));
        this.setInputValueSafe("timer-finish-sound", localStorage.getItem("timer-finish-sound"));
    }

    /**
     * Nullチェックを行い、値がNullでなければ指定要素IDに代入します。
     * @param element_id 代入先要素ID
     * @param value 値
     */
    public static setInputValueSafe(element_id: string, value: any) {
        if (value == null) return;
        let element = <HTMLInputElement>document.getElementById(element_id);
        element.value = value;
    }

    /**
     * TimeGroup IDのNullチェックを行い、NullでなければTimerGroup IDに代入します。
     * @param name Group ID
     */
    private static SetTimeGroupValueSafe(name: string) {
        let time_value = Storage.getSavedTime(name);
        if (time_value !== null) InputHelper.setTimeToTimeGroup(name, time_value);
    }
}