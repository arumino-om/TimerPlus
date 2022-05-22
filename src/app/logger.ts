export class Logger {
    public static log(classname: string, text: string) {
        console.log(`[${classname}] ${text};`);
    }

    public static error(classname: string, text: string) {
        console.error(`[${classname}] ${text};`);
    }
}