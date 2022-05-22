export class YoutubeURL {
    public static get_video_id(youtube_url: string): string | null {
        let url_type: number = -1;

        if (youtube_url.startsWith("https://www.youtube.com/watch?v=") || youtube_url.startsWith("https://youtube.com/watch?v=")) url_type = 0;
        else if (youtube_url.startsWith("https://youtu.be/")) url_type = 1
        else url_type = 2;

        if (url_type == 0) return this.id_extract_normal(youtube_url); //通常URL
        else if (url_type == 1) return this.id_extract_short(youtube_url); //短縮URL

        return null;
    }

    // 通常URLの動画ID抽出
    private static id_extract_normal(youtube_url: string): string | null {
        let split_url: string = youtube_url.split('v=')[1];

        if (split_url == null) return null;
        if (split_url.includes("&")) split_url = split_url.split("&")[0]; 

        return split_url;
    }

    // 短縮URLの動画ID抽出
    private static id_extract_short(youtube_url: string): string | null {
        let match: RegExpMatchArray | null = youtube_url.match("https:\/\/youtu\.be\/(.*$)");
        if (match == null) return null;
        return match[1];
    }

    public static get_playlist_id(youtube_url: string): string | null {
        if (youtube_url.startsWith("https://www.youtube.com/playlist?list=") || youtube_url.startsWith("https://youtube.com/playlist?list=")) {
            let split_url: string = youtube_url.split('list=')[1];

            if (split_url == null) return null;
            if (split_url.includes("&")) split_url = split_url.split("&")[0]; 
    
            return split_url;
        }

        return null;
    }
}