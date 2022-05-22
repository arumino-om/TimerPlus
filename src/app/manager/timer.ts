import { MainUIDOM } from "../dom/main_ui";
import { TimerDOM } from "../dom/timer";
import { TimerSettingDOM } from "../dom/timersetting";
import { InputHelper } from "../input_helper";
import { Pomodoro } from "../types/pomodoro";
import { Time } from "../types/time";
import { AudioManager } from "./audio";
import { WorkBGMManager } from "./workbgm";

export class TimerManager {
    private static timer_kind: string = "";
    private static startTime: Date | null = null;
    private static endTime: Date | null = null;
    private static pomodoro_info: Pomodoro | null = null;
    private static timer_interval: NodeJS.Timeout;
    private static nowTime: number | null = null;
    private static pauseStartTime: number | null = null
    private static nowAndPauseDiff: number | null = null;

    public static init() {
        TimerSettingDOM.init();

        let timer_select = <HTMLSelectElement>document.getElementById("timerKinds");
        timer_select.addEventListener("change", () => this.updateInitialTimer(timer_select.value));
        this.updateInitialTimer(timer_select.value);
    }

    public static updateInitialTimer(value: string) {
        this.timer_kind = value;
        switch (value) {
            case "timer":
                TimerDOM.setTime(InputHelper.getTimeFromTimeGroup("timer"));
                TimerDOM.setTimerDescription("Timer");
                break;

            case "stopwatch":
                TimerDOM.setTime(new Time());
                TimerDOM.setTimerDescription("Stopwatch");
                break;

            case "pomodoro":
                TimerDOM.setTime(InputHelper.getTimeFromTimeGroup("pomodoro-time"));
                TimerDOM.setTimerDescription(`Pomodoro 0 / ${TimerSettingDOM.getPomodoros()}`);
                break;
        
            default:
                break;
        }
    }

    public static startTimer() {
        MainUIDOM.showPauseButton();
        this.startTime = new Date();

        if (this.timer_kind == "pomodoro") {
            this.pomodoro_info = new Pomodoro(TimerSettingDOM.getPomodoros(), InputHelper.getTimeFromTimeGroup("pomodoro-time"),
                InputHelper.getTimeFromTimeGroup("pomodoro-shortsleep-time"), InputHelper.getTimeFromTimeGroup("pomodoro-longsleep-time"));
            this.pomodoro_info.now_pomodoro = 1;

            this.endTime = this.startTime;
            this.endTime.setHours(this.endTime.getHours() + this.pomodoro_info!.pomodoro_time.hour, this.endTime.getMinutes() + this.pomodoro_info!.pomodoro_time.minute,
                this.endTime.getSeconds() + this.pomodoro_info!.pomodoro_time.second, this.endTime.getMilliseconds() + this.pomodoro_info!.pomodoro_time.milisecond);

            TimerDOM.setTimerDescription(`Pomodoro ${this.pomodoro_info.now_pomodoro} / ${TimerSettingDOM.getPomodoros()}`);
        }
        else if (this.timer_kind == "timer") {
            let time = InputHelper.getTimeFromTimeGroup("timer");
            this.endTime = this.startTime;
            this.endTime.setHours(this.endTime.getHours() + time.hour, this.endTime.getMinutes() + time.minute,
                this.endTime.getSeconds() + time.second, this.endTime.getMilliseconds() + time.milisecond);
        }
        AudioManager.playAudio("start.mp3");
        this.timer_interval = setInterval(() => this.updateTimer(), 10);
    }

    public static updateTimer() {
        this.nowTime = Date.now();
        if (this.nowAndPauseDiff != null) {
            this.nowTime -= this.nowAndPauseDiff; //ポーズ分の時間を引く
        }
        let diff: number = this.nowTime - this.startTime!.getTime();
        let diff_time: number;
        switch (this.timer_kind) {
            case "timer":
                if (this.nowTime >= this.endTime!.getTime()) {
                    AudioManager.playFinishAudio();
                    this.resetTimer();
                    MainUIDOM.changeToMainUI();
                    WorkBGMManager.stopWorkBGM();
                    MainUIDOM.setBackgroundTransparency(1);
                    return;
                }

                diff_time = this.endTime!.getTime() - this.nowTime;
                TimerDOM.setTime(this.getTimeClass(diff_time));
                break;

            case "stopwatch":
                TimerDOM.setTime(this.getTimeClass(diff));
                break;

            case "pomodoro":
                if (this.nowTime >= this.endTime!.getTime()) {
                    //次のポモドーロの初期化
                    this.startTime = new Date();
                    this.endTime = null;
                    this.nowTime = null;
                    this.nowAndPauseDiff = null;
                    this.pauseStartTime = null;

                    if (!this.pomodoro_info!.is_sleep) { //ポモドーロ休憩に入ってない時
                        AudioManager.playFinishAudio();
                        WorkBGMManager.pauseWorkBGM();

                        if (this.pomodoro_info!.now_pomodoro >= this.pomodoro_info!.pomodoros) { //最後のポモドーロの場合
                            this.endTime = this.startTime;
                            this.endTime.setHours(this.endTime.getHours() + this.pomodoro_info!.pomodoro_longsleep_time.hour, this.endTime.getMinutes() + this.pomodoro_info!.pomodoro_longsleep_time.minute,
                                this.endTime.getSeconds() + this.pomodoro_info!.pomodoro_longsleep_time.second, this.endTime.getMilliseconds() + this.pomodoro_info!.pomodoro_longsleep_time.milisecond);
                            TimerDOM.setTimerDescription(`Pomodoro ${this.pomodoro_info!.now_pomodoro} / ${TimerSettingDOM.getPomodoros()} (Long sleep)`);
                        } else {
                            this.endTime = this.startTime;
                            this.endTime.setHours(this.endTime.getHours() + this.pomodoro_info!.pomodoro_shortsleep_time.hour, this.endTime.getMinutes() + this.pomodoro_info!.pomodoro_shortsleep_time.minute,
                                this.endTime.getSeconds() + this.pomodoro_info!.pomodoro_shortsleep_time.second, this.endTime.getMilliseconds() + this.pomodoro_info!.pomodoro_shortsleep_time.milisecond);
                            TimerDOM.setTimerDescription(`Pomodoro ${this.pomodoro_info!.now_pomodoro} / ${TimerSettingDOM.getPomodoros()} (Sleep)`);
                        }
                        this.pomodoro_info!.is_sleep = true;
                        return;
                    } else { //ポモドーロ休憩終了後
                        AudioManager.playAudio("start.mp3");
                        WorkBGMManager.resumeWorkBGM();
                        this.pomodoro_info!.is_sleep = false;
                        if (this.pomodoro_info!.now_pomodoro >= this.pomodoro_info!.pomodoros) this.pomodoro_info!.now_pomodoro = 1;
                        else this.pomodoro_info!.now_pomodoro += 1;
                        
                        this.endTime = this.startTime;
                        this.endTime.setHours(this.endTime.getHours() + this.pomodoro_info!.pomodoro_time.hour, this.endTime.getMinutes() + this.pomodoro_info!.pomodoro_time.minute,
                            this.endTime.getSeconds() + this.pomodoro_info!.pomodoro_time.second, this.endTime.getMilliseconds() + this.pomodoro_info!.pomodoro_time.milisecond);
                        TimerDOM.setTimerDescription(`Pomodoro ${this.pomodoro_info!.now_pomodoro} / ${TimerSettingDOM.getPomodoros()}`);
                    }
                    
                    return;
                }

                diff_time = this.endTime!.getTime() - this.nowTime;
                TimerDOM.setTime(this.getTimeClass(diff_time));
                break;
        
            default:
                break;
        }
    }

    public static resumeTimer() {
        this.nowAndPauseDiff = Date.now() - this.nowTime!;
        this.timer_interval = setInterval(() => this.updateTimer(), 10);
        WorkBGMManager.resumeWorkBGM();
        MainUIDOM.showPauseButton();
    }

    public static pauseTimer() {
        this.pauseStartTime = Date.now();
        clearInterval(this.timer_interval);
        WorkBGMManager.pauseWorkBGM();
        MainUIDOM.showResumeButton();
    }

    public static resetTimer() {
        this.startTime = null;
        this.endTime = null;
        this.nowTime = null;
        this.nowAndPauseDiff = null;
        this.pauseStartTime = null;
        clearInterval(this.timer_interval);
        this.updateInitialTimer(this.timer_kind);
        MainUIDOM.showStartButton();
    }

    private static getTimeClass(diff: number): Time {
        let diff_hour = diff / (1000 * 60 * 60);
        let diff_minute = (diff_hour - Math.floor(diff_hour)) * 60;
        let diff_second = (diff_minute - Math.floor(diff_minute)) * 60;
        let diff_milisecond = (diff_second - Math.floor(diff_second)) * 100;
        return new Time(Math.floor(diff_hour), Math.floor(diff_minute), Math.floor(diff_second), Math.floor(diff_milisecond));
    }
}