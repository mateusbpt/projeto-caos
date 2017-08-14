import { Routes } from './routes';
import { Configuration } from './../config/config.api';
import { Database } from './database';
import { Server } from 'http';
import * as Utils from './utils';

(function startServer() {

    let serverConfig: Configuration.IConfiguration = require('./../config/config.json');

    Routes.createServer()
        .then((serverInstance: Server) => {
            serverInstance.on('listening', () => {
                Utils.Notifier.notifyInfo('Hurray, Gouda started successfully!');
                Utils.Logger.logAndNotify(`Gouda has started successfully.`);
                Utils.Logger.logAndNotify(`Listening on port ${serverConfig.server.ports.api}`);
            });
            serverInstance.listen(serverConfig.server.ports.api);
            process
                .on('exit', onExit(false, serverInstance))
                .on('SIGINT', onExit(true))
                .on('uncaughtException', onExit(true));
        })
        .catch((message: any) => {
            Utils.Notifier.notifyError('Damn, Gouda was unable to accomplish its start :(');
            Utils.Logger.errorAndNotify(`Gouda couldn't start. Message: ${message}`);
            process.exit(1);
        });

})();

function onExit(isError: boolean, server?: Server): Function {
    return isError ?
        () => {
            Database.disconnect();
            if (server) {
                server.removeAllListeners();
            }
            Utils.Notifier.notifyInfo('Gouda is shutting down. Fare thee well, Stranger.');
            Utils.Logger.logAndNotify(`Shutting Gouda down.`);
        } :
        (message: any) => {
            Utils.Notifier.notifyInfo('Oh oh! Gouda had an unexpected problem!');
            Utils.Logger.logAndNotify(`There was an unexpected error. Message: ${message}`);
        };
}