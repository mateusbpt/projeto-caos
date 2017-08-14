import * as mongoose from 'mongoose';
import * as Utils from './../utils';
import { Configuration } from './../../config/config.api';
import { UserEntity } from './entity.user';

let config: Configuration.IConfiguration = require('./../../config/config.json');

export namespace Database {

    function configure() {
        (<any>mongoose).Promise = global.Promise;
    }

    export function connect(): Promise<any> {
        configure();
        return mongoose.connect(config.database.connectionString)
            .then(() => {
                Utils.Logger.logAndNotify(`mongoose conected on ${config.database.connectionString}`, 'connection to MongoDB');
                if (config.database.clearDatabase) {
                    mongoose.connection.db.dropDatabase();
                }
                registerDocuments();

            })
            .catch((reason: any) => {
                throw 'Failed to connect to database.';
            });
    }

    export function disconnect() {
        mongoose.disconnect();
    }

    function registerDocuments() {
        UserEntity.get().register();
    }

}

export namespace Entity {

    export interface EntityMapper<T extends mongoose.Document> {
        register(): void;
        document(): mongoose.Model<T>;
    }

}