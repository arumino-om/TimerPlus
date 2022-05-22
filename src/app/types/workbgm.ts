export class WorkBGM {
    public title: string;
    public publisher: string;
    public video_id: string;
    public thumbnail_url: string;
    public cannot_play: boolean

    constructor(title: string, publisher: string, video_id: string, thumbnail_url: string) {
        this.title = title;
        this.publisher = publisher;
        this.video_id = video_id;
        this.thumbnail_url = thumbnail_url;
        this.cannot_play = false;
    }
}

export type WorkBGMType = {
    title: string;
    publisher: string;
    video_id: string;
    thumbnail_url: string;
    cannot_play: boolean
}