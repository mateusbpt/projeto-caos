import * as nodeNotifier from 'node-notifier';

export namespace Notifier {

    export function notifyInfo(message: string) {
        nodeNotifier.notify({
            title: 'Gouda Info',
            message: message,
            sound: true
        });
    }

    export function notifyError(message: string) {
        nodeNotifier.notify({
            title: 'Gouda Error',
            message: message,
            sound: true
        });
    }

}