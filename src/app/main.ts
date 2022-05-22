import { OverMenu } from "./over_menu";
import { WorkBGMManager } from "./manager/workbgm";
import { TimerManager } from "./manager/timer";
import { InputHelper } from "./input_helper";
import { MainUIDOM } from "./dom/main_ui";
import { TimerSettingDOM } from "./dom/timersetting";

window.onload = () => {
    OverMenu.init();
    InputHelper.init();
    WorkBGMManager.init();
    TimerManager.init();
    // MainUIDOM.setBackgroundColor("white");
    MainUIDOM.setBackgroundTransparency(1);

    MainUIDOM.setScriptVersion("1.1");

    let start_btn = document.getElementById("start");
    start_btn!.addEventListener("click", () => {
        if (MainUIDOM.is_stop_button) TimerManager.pauseTimer();
        else if (MainUIDOM.is_paused) TimerManager.resumeTimer();
        else {
            WorkBGMManager.playWorkBGM();
            TimerManager.startTimer();
        }
        MainUIDOM.changeToTimerUI();
        // if (WorkBGMManager.hasWorkBGM()) MainUIDOM.setBackgroundColor("transparent");
        if (WorkBGMManager.hasWorkBGM()) MainUIDOM.autoSetBackgroundStyleFromSettings();
    });

    let reset_btn = document.getElementById("reset");
    reset_btn!.addEventListener("click", () => {
        WorkBGMManager.stopWorkBGM();
        TimerManager.resetTimer();
        MainUIDOM.changeToMainUI();
        // MainUIDOM.setBackgroundColor("white");
        MainUIDOM.setBackgroundTransparency(1);
    });

    let fullscreen_btn = document.getElementById("fullscreen");
    fullscreen_btn!.addEventListener("click", () => {
        if (document.fullscreenElement !== undefined && document.fullscreenElement !== null) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log("ServiceWorker registration succesful.");
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
}
