import { User } from './../database/entity.user';

export interface MappedUser {
    name: string;
    created: Date;
    id: number;
    username: string;
}

export class UserMapper {

    static map(user: User): MappedUser {
        return {
            name: user.name,
            created: user.created,
            id: user.userId,
            username: user.username
        };
    }

}