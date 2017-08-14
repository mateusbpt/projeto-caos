import { User, UserBuilder, UserDAO } from './../database/entity.user';
import { UserMapper } from './../response';
import { Configuration } from './../../config/config.api';
import { HmacSHA256 } from 'crypto-js';
import * as Utils from './../utils';

let config: Configuration.IConfiguration = require('./../../config/config.json');

export namespace UserBiz {

    export function seedDatabase(): Promise<any> {
        return new Promise<any>((resolve: Function, reject: Function) => {
            let users: User[] = require('./../../config/mongo-seed').User;
            users.forEach((user: User) => {
                UserDAO.create(user)
                    .then((created: User) => Utils.Logger.logAndNotify(`seeded User ${created.username}`, 'mongodb-seed'))
                    .catch((reason: any) => Utils.Logger.errorAndNotify(`problem while seeding User: ${reason}`, 'mongodb-seed') && reject());
            });
            resolve();
        });
    }

    export function getUserInformation(userId: any): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            if (!userId || !Utils.Validation.isInteger(userId)) {
                return reject(`The value ${userId} is not valid as an id.`);
            }
            UserDAO.findById(userId)
                .then((user: User) => {
                    resolve(UserMapper.map(user));
                })
                .catch((reason: any) => reject(`It was not possible to acquire the information for id ${userId}.`));
        });
    }

    export function createUser(userData: any): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            if (!UserBusiness.typeCheck(userData)) {
                return reject('Invalid User: the body of this request did not meet the expectations.');
            } else if (UserBusiness.isAnInvalidPassword(userData.password)) {
                return reject(`Invalid User: the password doesn't meet the requirements.`);
            } else if (UserBusiness.isAnInvalidUsername(userData.username)) {
                return reject(`Invalid User: the username doesn't meet the requirements.`);
            }
            let user: User = new UserBuilder()
                .withName(userData.name)
                .withUsername(userData.username)
                .withPassword(HmacSHA256(userData.password, config.security.key).toString())
                .build();
            UserDAO.usernameExists(user.username)
                .then((exists: boolean) => {
                    if (exists) {
                        return reject(`Invalid User: the username ${user.username} already exists.`);
                    } else {
                        return UserDAO.create(user);
                    }
                })
                .then((created: User) => resolve(UserMapper.map(created)))
                .catch((reason: any) => reject('It was not possible to create this User.'));
        });
    }

    export function deleteUser(userId: any): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            if (!userId || !Utils.Validation.isInteger(userId)) {
                return reject(`The value ${userId} is not valid as an id.`);
            }
            if (parseInt(userId) === 1) {
                return reject(`The superuser cannot be deleted.`);
            }
            UserDAO.removeById(userId)
                .then((user: User) => {
                    resolve(UserMapper.map(user));
                })
                .catch((reason: any) => reject(`No user with id ${userId} could be found.`));
        });
    }

    class UserBusiness {

        static typeCheck(object: any): boolean {
            return 'name' in object &&
                'username' in object &&
                'password' in object;
        }

        static isAnInvalidPassword(password: string) {
            let isTooBig: boolean = password.length > 50;
            let isTooShort: boolean = password.length < 8;
            return isTooBig || isTooShort;
        }

        static isAnInvalidUsername(username: string) {
            let isTooBig: boolean = username.length > 16;
            let isTooShort: boolean = username.length < 5;
            let hasInvalidCharacter: boolean = /^.*?(?=[\^#%&$@¨`´^~!.,\*:<>\?/\{\|\}]).*$/g.test(username);
            return isTooBig || isTooShort || hasInvalidCharacter;
        }

    }

}