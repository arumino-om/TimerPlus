import { WorkBGM } from "../types/workbgm";
import { Storage } from "../manager/storage";

export class WorkBGMDOM {
    public static init() {
        const element = document.getElementById('workBgm');
        if (element == null) {
            const element = document.getElementById('workBgm');
            window.addEventListener('DOMContentLoaded', (event) => {
                let observer = new MutationObserver(() => {
                    if (!element?.classList.contains("is-show")) this.saveWorkBGMs(); //閉じられた時
                });
                const config = { attributes: true };
                observer.observe(<Node>element, config);
            });
        }
        let observer = new MutationObserver(() => {
            if (!element?.classList.contains("is-show")) this.saveWorkBGMs(); //閉じられた時
        });
        const config = { attributes: true };
        observer.observe(<Node>element, config);

        this.resumeSavedWorkBGMs();
    }

    private static saveWorkBGMs() {
        let workbgms = this.getAllWorkBGM();
        Storage.saveObject("workbgms", workbgms);
    }

    private static resumeSavedWorkBGMs() {
        let workbgms = <WorkBGM[] | null>Storage.getSavedObject("workbgms");
        if (workbgms == null) return;

        workbgms.forEach(workbgm => {
            this.appendWorkBGM(workbgm);
        });
    }

    public static appendWorkBGM(workbgm: WorkBGM): number {
        if (this.getWorkBGM(workbgm.video_id) != null) return 1;
        const base_html = `
        <img class="rounded sm:max-h-40" src="${workbgm.thumbnail_url}">

        <div class="mx-2 items-center overflow-hidden">
            <p class="truncate text-lg workbgm-title">${workbgm.title}</p>
            <p class="text-gray-400 text-sm truncate workbgm-publisher">${workbgm.publisher}</p>
            <button class="workbgm-action-bgm hover:bg-red-50 active:bg-red-300 workbgm-remove-button" for="${workbgm.video_id}">削除</button>
            <p class="cannotplay" style="color:red;"></p>
        </div>
        `

        let div = document.createElement("div");
        div.innerHTML = base_html;
        div.setAttribute("data-ytid", workbgm.video_id);
        div.classList.add("workbgm-list");
        let container = document.getElementById("workbgm-list-container");
        container?.appendChild(div);

        let remove_btn = div.querySelector(".workbgm-remove-button");
        remove_btn!.addEventListener("click", () => {
            this.removeWorkBGM(workbgm);
        });
        return 0;
    }

    public static removeWorkBGM(workbgm: WorkBGM) {
        let target = document.querySelector(`div[data-ytid="${workbgm.video_id}"]`);
        if (target == null) return;
        let container = document.getElementById("workbgm-list-container");
        container!.removeChild(target);
    }

    public static appendWorkBGMFromRaw(title: string, publisher: string, thumbnail_url: string, video_id: string): number {
        return this.appendWorkBGM(new WorkBGM(title, publisher, video_id, thumbnail_url));
    }

    public static getWorkBGM(video_id: string): WorkBGM | null {
        const workbgm_dom = document.querySelector(`div.workbgm-list[data-ytid='${video_id}']`);
        if (workbgm_dom == null) return null;

        const title = workbgm_dom.getElementsByClassName("workbgm-title")[0].textContent;
        const publisher = workbgm_dom.getElementsByClassName("workbgm-publisher")[0].textContent;
        const thumbnail_url = workbgm_dom.getElementsByTagName("img")[0].src;
        
        return new WorkBGM(title ?? "Title", publisher ?? "Publisher", video_id, thumbnail_url);
    }

    public static getAllWorkBGM(): WorkBGM[] | null {
        const workbgm_dom = document.querySelectorAll(`div.workbgm-list`);
        if (workbgm_dom.length <= 0) return null;

        let workbgm_list: Array<WorkBGM> = new Array<WorkBGM>();
        workbgm_dom.forEach((item: Element) => {
            const title = item.getElementsByClassName("workbgm-title")[0].textContent;
            const publisher = item.getElementsByClassName("workbgm-publisher")[0].textContent;
            const thumbnail_url = item.getElementsByTagName("img")[0].src;
            const video_id = item.getAttribute("data-ytid");

            // Video IDがあるときのみ追加
            if (video_id != null) workbgm_list.push(new WorkBGM(title ?? "Title", publisher ?? "Publisher", video_id, thumbnail_url)); 
        });

        return workbgm_list;
    }

    public static setErrorMessage(text: string, remove_notification: boolean = true) {
        if (remove_notification) this.setNotificationMessage("", false);
        let error_message = document.getElementById("workbgm-error")!;
        error_message.textContent = text;
    }

    public static setNotificationMessage(text: string, remove_error: boolean = true) {
        if (remove_error) this.setErrorMessage("", false);
        let notification_message = document.getElementById("workbgm-message")!;
        notification_message.textContent = text;
    }

    public static setCannotPlayStatus(video_id: string, can_play: boolean, custommessage: string | null = null) {
        let workbgm_dom = document.querySelector(`div.workbgm-list[data-ytid='${video_id}']`);
        if (workbgm_dom == null) return null;

        let cannotplay_dom = workbgm_dom.getElementsByClassName("cannotplay")[0];
        if (can_play) cannotplay_dom.textContent = "";
        else if (custommessage == null) cannotplay_dom.textContent = "再生できません";
        else cannotplay_dom.textContent = custommessage;
    }

    public static getShuffleEnabled(): boolean {
        let shuffle_enabled = <HTMLInputElement>document.getElementById("shuffle_enabled");
        return shuffle_enabled.checked;
    }
}