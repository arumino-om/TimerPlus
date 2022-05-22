import { Time } from "../types/time";
import { WorkBGM } from "../types/workbgm";

export class Storage {
    public static saveTime(name: string, value: Time) {
        localStorage.setItem(name, `${value.hour}:${value.minute}:${value.second}:${value.milisecond}`);
    }

    public static getSavedTime(name: string) {
        let time = localStorage.getItem(name);
        if (time === null) return null;

        let splited_time = time.split(":");
        return new Time(parseInt(splited_time[0]), parseInt(splited_time[1]), parseInt(splited_time[2]), parseInt(splited_time[3]));
    }

    public static saveObject(name: string, workbgm_array: any) {
        localStorage.setItem(name, JSON.stringify(workbgm_array));
    }

    public static getSavedObject(name: string): any {
        let object = localStorage.getItem(name);
        if (object == null) return null;
        return JSON.parse(object);
    }
}