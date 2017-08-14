export namespace FileSystem {

    export function checkIfFileExists(path: string) {
        return new Promise((resolve: Function, reject: Function) => {
            resolve();
        });
    }

    export function removeFile(path: string) {
        return;
    }

    export function copyAndRemoveFile(path: string, destination: string) {
        return new Promise<any>((resolve: Function, reject: Function) => {
            resolve(undefined);
        });
    }

    export function createDirectory(path: string) {
        return new Promise<any>((resolve: Function, reject: Function) => {
            resolve(undefined);
        });
    };

    export function removeDirectory(path: string): any {
        return undefined;
    }

    export function renameFile(path: string) {
        return;
    }

}