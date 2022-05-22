import { TimerSettingDOM } from "./timersetting";

export class MainUIDOM {
    public static is_stop_button = false;
    public static is_paused = false;

    public static showPauseButton() {
        let start_button = document.getElementById("start");
        start_button!.textContent = "ポーズ";
        this.is_stop_button = true;
        this.is_paused = false;
    }

    public static showStartButton() {
        let start_button = document.getElementById("start");
        start_button!.textContent = "スタート";
        this.is_stop_button = false;
        this.is_paused = false;
    }

    public static showResumeButton() {
        let start_button = document.getElementById("start");
        start_button!.textContent = "再開";
        this.is_stop_button = false;
        this.is_paused = true;
    }

    public static changeToTimerUI() {
        let reset_button = document.getElementById("reset");
        reset_button?.classList.remove("disabled");

        let mainui_only_dom = document.querySelectorAll("[data-mainonly='true']");
        mainui_only_dom.forEach(item => {
            item.classList.add("disabled");
            item.classList.add("hidden");
        });
    }

    public static changeToMainUI() {
        let reset_button = document.getElementById("reset");
        reset_button?.classList.add("disabled");

        let mainui_only_dom = document.querySelectorAll("[data-mainonly='true']");
        mainui_only_dom.forEach(item => {
            item.classList.remove("disabled");
            item.classList.remove("hidden");
        });
    }

    public static setBackgroundColor(bg: string) {
        let main = document.getElementById("main");
        if (main == null) return;
        main.classList.remove(`bg-${main.getAttribute("data-now-bgcolor")!}`);
        main.classList.add(`bg-${bg}`);
        main.setAttribute("data-now-bgcolor", bg);
    }

    public static autoSetBackgroundStyleFromSettings() {
        this.setBackgroundTransparency(TimerSettingDOM.getWorkbgmTransparency() / 100);
        this.setBackgroundBlur(TimerSettingDOM.getWorkbgmBlur());
    }

    public static setBackgroundTransparency(transparency: number) {
        let main = document.getElementById("main");
        if (main == null) return;
        main.style.backgroundColor = `rgba(255, 255, 255, ${transparency}`;
    }

    public static setBackgroundBlur(blur: number) {
        let youtube_background = document.getElementById("youtube-background");
        if (youtube_background == null) return;
        youtube_background.style.filter = `blur(${blur}px)`;
    }

    public static setScriptVersion(version: string) {
        console.log("Timer Plus Version: " + version);
        let version_elements = document.querySelectorAll(".version");
        if (version_elements == null) return;
        version_elements.forEach(item => {
            item.textContent = version;
        })
    }
}