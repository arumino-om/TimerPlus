import { TimerSettingDOM } from "../dom/timersetting";

export class AudioManager {
    public static playAudio(audio_path: string, volume: number = 100) {
        let audioCtx = new AudioContext();

        fetch('./sounds/' + audio_path)
            .then(async (result) => {
                audioCtx.decodeAudioData(await result.arrayBuffer(), (audioBuffer) => {
                    const audioSource = audioCtx.createBufferSource();
                    audioSource.buffer = audioBuffer;
                    audioSource.connect(audioCtx.destination);
                    audioSource.start();
                });
            });
    }

    public static playFinishAudio() {
        let finish_sound = TimerSettingDOM.getFinishSound();
        this.playAudio("finish/" + finish_sound);
    }
}