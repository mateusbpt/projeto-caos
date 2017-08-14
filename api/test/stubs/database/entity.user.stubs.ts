import { User, UserBuilder } from './../../../database/entity.user';

export {
    User,
    UserBuilder
}

export class UserDAO {

    static list: User[] = [
        {
            userId: 1,
            created: new Date(),
            name: 'superadmin',
            username: 'superadmin',
            password: 'gandalfs2'
        },
        {
            userId: 2,
            created: new Date(),
            name: 'Nick Cage',
            username: 'cageynick_77',
            password: 'ohhoneyhoney'
        },
        {
            userId: 3,
            created: new Date(),
            name: 'Brendan Eich',
            username: 'breich',
            password: '10daysman'
        },
        {
            userId: 4,
            created: new Date(),
            name: 'Bob Dylan',
            username: 'dbobd',
            password: 'rainyDayWomen#1235'
        }
    ];

    static create(user: User): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            user.userId = UserDAO.list.length + 1;
            resolve(user);
        });
    }

    static findById(id: number): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            return UserDAO.list.some((user: User) => user.userId === id) ?
                resolve(UserDAO.list
                    .filter((user: User) => user.userId === id)
                    .pop())
                :
                resolve(undefined);
        });
    }

    static findAll(): Promise<User[]> {
        return new Promise<User[]>((resolve: Function, reject: Function) => {
            resolve(UserDAO.list);
        });
    }

    static findByUsername(username: string): Promise<User> {
        return new Promise<User>((resolve: Function, reject: Function) => {
            return UserDAO.list.some((user: User) => user.username === username) ?
                resolve(UserDAO.list
                    .filter((user: User) => user.username === username)
                    .pop())
                :
                resolve(undefined);
        });
    }

    static usernameExists(username: string): Promise<boolean> {
        return new Promise<boolean>((resolve: Function, reject: Function) => {
            return resolve(UserDAO.list.some((user: User) => user.username === username));
        });
    }

    static removeById(id: number): Promise<any> {
        return new Promise<any>((resolve: Function, reject: Function) => {
            return UserDAO.list.some((user: User) => user.userId === id) ?
                resolve(UserDAO.list
                    .filter((user: User) => user.userId === id)
                    .pop())
                :
                resolve(undefined);
        });
    }

};