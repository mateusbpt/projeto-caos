export namespace Logger {

    export function log(data: any) {
        console.log(data);
    }

    export function error(data: any) {
        console.error(data);
    }

    export function logAndNotify(data: any, headline?: string) {
        let formattedHeadline = headline ? ` (${headline})` : '';
        Logger.log(`INFORMATIONAL LOG${formattedHeadline}: ${data}`);
    }

    export function errorAndNotify(data: any, headline?: string) {
        let formattedHeadline = headline ? ` (${headline})` : '';
        Logger.error(`EXCEPTIONAL ERROR LOG${formattedHeadline}: ${data}`);
    }

}