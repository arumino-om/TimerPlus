import { WorkBGMDOM } from "../dom/workbgm";
import { YoutubeURL } from "../url/youtube";
import { WorkBGM } from "../types/workbgm";
import { Logger } from "../logger";

interface WindowWorkBGMInterface {
    enableWorkBGMs: WorkBGM[] | null
    youtubePlayer: YT.Player
    nowPlayTrack: number
    onStateChangeHandler: any,
    onErrorHandler: any,
    nextWorkBGM: any,
    getRandomPlayWorkBGM: any,
}
declare let window: WindowWorkBGMInterface

export class WorkBGMManager {
    private static CLASSNAME = "WorkBGM";

    public static init() {
        WorkBGMDOM.init();
        let url_input = <HTMLInputElement>document.getElementById("youtube-url-input")!;
        let workbgm_add_button = <HTMLElement>document.getElementById("workbgm-add-btn")!;

        url_input.addEventListener("keypress", (e) => {
            console.log("" + e.key);
            if (e.key == "Enter") {
                if (url_input.value.startsWith("https://www.youtube.com/playlist?list=") || url_input.value.startsWith("https://youtube.com/playlist?list=")) this.addWorkBGMFromPlaylist(url_input.value);
                else this.addWorkBGM(url_input.value);
            }
        });
        workbgm_add_button.addEventListener("click", () => {
            if (url_input.value.startsWith("https://www.youtube.com/playlist?list=") || url_input.value.startsWith("https://youtube.com/playlist?list=")) this.addWorkBGMFromPlaylist(url_input.value);
            else this.addWorkBGM(url_input.value);
        });

        window.onStateChangeHandler = this.stateChangeHandler;
        window.onErrorHandler = this.errorHandler;
        window.nextWorkBGM = this.nextWorkBGM;
        window.getRandomPlayWorkBGM = this.getRandomPlayWorkBGM;

        this.createYoutubeIframe();
    }

    private static addWorkBGM(youtube_url: string) {
        WorkBGMDOM.setErrorMessage("");
        let video_id = YoutubeURL.get_video_id(youtube_url);
        if (video_id == null) {
            WorkBGMDOM.setErrorMessage("Youtube動画のURLではありません。");
            return;
        }
        if (WorkBGMDOM.getWorkBGM(video_id) != null) {
            WorkBGMDOM.setErrorMessage("同じ動画を重複して登録することはできません。");
            return;
        }

        WorkBGMDOM.setNotificationMessage("動画情報を取得しています…");

        fetch(`./api/youtube/get_video_info.php?id=${video_id}`)
            .then(response => {
                return response.json();
            })
            .then(json => {
                WorkBGMDOM.appendWorkBGMFromRaw(json["title"], json["publisher"], json["thumbnail"], video_id!);
            })
            .catch(response => {
                WorkBGMDOM.setErrorMessage("内部エラーが発生しました。");
                console.error("[WorkBGM] Error occured adding work bgm: ");
                Logger.error(this.CLASSNAME, `Error occured adding work bgm: `);
                WorkBGMDOM.appendWorkBGMFromRaw(video_id!, "Unknown", "", video_id!);
                return response.json();
            })
            .catch(json => {
                console.log(json);
            });

        WorkBGMDOM.setNotificationMessage("");
        return;
    }

    private static addWorkBGMFromPlaylist(youtube_url: string) {
        WorkBGMDOM.setErrorMessage("");
        let playlist_id = YoutubeURL.get_playlist_id(youtube_url);
        if (playlist_id == null) {
            WorkBGMDOM.setErrorMessage("YoutubeプレイリストのURLではありません。");
            return;
        }

        WorkBGMDOM.setNotificationMessage("プレイリストから動画情報を取得しています…");

        fetch(`./api/youtube/get_playlist_videos.php?id=${playlist_id}`)
            .then(response => {
                return response.json();
            })
            .then(json => {
                for (let i = 0; i < json.length; i++) {
                    WorkBGMDOM.appendWorkBGMFromRaw(json[i]["title"], json[i]["publisher"], json[i]["thumbnail"], json[i]["video_id"]);
                }
            })
            .catch(response => {
                WorkBGMDOM.setErrorMessage("APIエラーが発生しました。");
                console.error("[WorkBGM] API Error!!!");
                WorkBGMDOM.appendWorkBGMFromRaw(playlist_id!, "Unknown", "", playlist_id!);
                return response.json();
            })
            .catch(json => {
                console.log(json);
            });

        WorkBGMDOM.setNotificationMessage("");
        return;
    }

    public static getRandomPlayWorkBGM(): number {
        let random = Math.floor(Math.random() * window.enableWorkBGMs!.length);
        if (window.nowPlayTrack == random) return random++;
        else return random;
    }

    public static playWorkBGM() {
        window.enableWorkBGMs = WorkBGMDOM.getAllWorkBGM();
        if (window.enableWorkBGMs == null) return;

        window.nowPlayTrack = 0;
        if (WorkBGMDOM.getShuffleEnabled()) window.youtubePlayer.loadVideoById(window.enableWorkBGMs![window.getRandomPlayWorkBGM()].video_id);
        else window.youtubePlayer.loadVideoById(window.enableWorkBGMs![window.nowPlayTrack].video_id);
    }

    public static pauseWorkBGM() {
        window.youtubePlayer.pauseVideo();
    }

    public static resumeWorkBGM() {
        window.youtubePlayer.playVideo();
    }

    private static nextWorkBGM() {
        if (window.enableWorkBGMs!.length == 1) window.youtubePlayer.seekTo(0, true);

        if (WorkBGMDOM.getShuffleEnabled()) window.youtubePlayer.loadVideoById(window.enableWorkBGMs![window.getRandomPlayWorkBGM()].video_id);
        else {
            window.nowPlayTrack++;
            if (window.nowPlayTrack > window.enableWorkBGMs!.length - 1) window.nowPlayTrack = 0;
            window.youtubePlayer.loadVideoById(window.enableWorkBGMs![window.nowPlayTrack].video_id);
        }
    }

    private static stateChangeHandler(event: YT.OnStateChangeEvent) {
        if (event.data == YT.PlayerState.ENDED) window.nextWorkBGM();
    }

    private static errorHandler(event: YT.OnErrorEvent) {
        window.enableWorkBGMs![window.nowPlayTrack].cannot_play = true;

        switch (event.data) {
            // YT.PlayerError.EmbeddingNotAllowed || YT.PlayerError.EmbeddingNotAllowed2
            case 101:
            case 150:
                WorkBGMDOM.setCannotPlayStatus(window.enableWorkBGMs![window.nowPlayTrack].video_id, false, "作成者によって動画の埋め込みが許可されていないため、再生できません。");
                break;

            // YT.PlayerError.Html5Error
            case 5:
                WorkBGMDOM.setCannotPlayStatus(window.enableWorkBGMs![window.nowPlayTrack].video_id, false, "HTML5プレイヤー関係でエラーが発生しました。");
                break;

            // YT.PlayerError.InvalidParam
            case 2:
                WorkBGMDOM.setCannotPlayStatus(window.enableWorkBGMs![window.nowPlayTrack].video_id, false, "技術的なエラーが発生しました。開発者に報告してください。(Invalid Param)");
                break;

            // YT.PlayerError.VideoNotFound
            case 100:
                WorkBGMDOM.setCannotPlayStatus(window.enableWorkBGMs![window.nowPlayTrack].video_id, false, "動画が存在しません。");
                break;
        }

        window.nextWorkBGM();
    }

    private static createYoutubeIframe() {
        window.youtubePlayer = new YT.Player("youtube-wrapper", {
            events: {
                onStateChange: window.onStateChangeHandler,
                onError: window.onErrorHandler
            },
            playerVars: {
                autoplay: <YT.AutoPlay.AutoPlay>1,
                playsinline: <YT.PlaysInline>1,
                modestbranding: <YT.ModestBranding>1
            }
        });
    }

    public static stopWorkBGM() {
        window.enableWorkBGMs = null;
        window.youtubePlayer.stopVideo();
    }

    public static hasWorkBGM(): boolean {
        if (window.enableWorkBGMs == null) return false;
        if (window.enableWorkBGMs!.length <= 0) return false;
        else return true;
    }
}