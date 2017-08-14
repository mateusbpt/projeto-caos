import { User, UserBuilder, UserDAO } from './../database/entity.user';
import { UserMapper } from './../response';
import { Configuration } from './../../config/config.api';
import { HmacSHA256 } from 'crypto-js';
import { sign, SignOptions } from 'jsonwebtoken';

let config: Configuration.IConfiguration = require('./../../config/config.json');

export namespace LoginBiz {

    export function login(loginData: any): Promise<User> {
        let loginErrorMessage = 'Either this user does not exist or the passoword did not match.';
        return new Promise<User>((resolve: Function, reject: Function) => {
            if (!LoginBusiness.typeCheck(loginData)) {
                return reject('Invalid login data: the body of this request did not meet the expectations,');
            }
            UserDAO.findByUsername(loginData.username)
                .then((user: User) => {
                    user.password === HmacSHA256(loginData.password, config.security.key).toString() ?
                        resolve({
                            user: UserMapper.map(user),
                            token: LoginBusiness.signAndGenerateToken(user)
                        }) :
                        reject(loginErrorMessage);
                })
                .catch((reason: any) => reject(loginErrorMessage));
        });
    }

    class LoginBusiness {

        static typeCheck(object: any): boolean {
            return 'username' in object &&
                'password' in object;
        }

        static signAndGenerateToken(user: User): string {
            return sign(user, config.security.tokenSecret, {
                expiresIn: config.security.tokenExpiration
            });
        }

    }

}