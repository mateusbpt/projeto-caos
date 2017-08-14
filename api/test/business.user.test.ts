import 'mocha';
import * as formidable from 'formidable';
import * as proxyquire from 'proxyquire';
import * as chai from 'chai';
import { Logger } from './../utils';
import { MappedUser } from './../response';
import { User } from './../database/entity.user';

let business = proxyquire('./../business/business.user',
    {
        './../database/entity.user': require('./stubs/database/entity.user.stubs')
    });

/**
 * UserBiz
 */
describe('UserBiz', () => {

    /**
     * Function getUserInformation
     */
    describe('getUserInformation', () => {

        it('should successfully get the user with id 1', (done: MochaDone) => {
            business.UserBiz.getUserInformation(1)
                .then((user: MappedUser) => {
                    chai.assert(user.id === 1, `Id ${user.id} is not equal to 1`);
                    chai.assert(user.name === 'superadmin', `Name ${user.name} is not equal to 'superadmin'`);
                    chai.assert(user.username === 'superadmin', `Username ${user.username} is not equal to 'superadmin'`);
                    chai.assert(typeof user.created === 'object', `typeof Created ${user.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should successfully get the user with id 3', (done: MochaDone) => {
            business.UserBiz.getUserInformation(3)
                .then((user: MappedUser) => {
                    chai.assert(user.id === 3, `Id ${user.id} is not equal to 3`);
                    chai.assert(user.name === 'Brendan Eich', `Name ${user.name} is not equal to 'Brendan Eich'`);
                    chai.assert(user.username === 'breich', `Username ${user.username} is not equal to 'breich'`);
                    chai.assert(typeof user.created === 'object', `typeof Created ${user.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should reject when inexistent user with id 12 is requested', (done: MochaDone) => {
            business.UserBiz.getUserInformation(12)
                .catch((reason: string) => {
                    chai.assert(reason === 'It was not possible to acquire the information for id 12.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should reject when id is 0, undefined, false, NaN or null', (done: MochaDone) => {
            business.UserBiz.getUserInformation(0)
                .catch((reason: string) => {
                    chai.assert(reason === 'The value 0 is not valid as an id.', `Reason message didn't meet the expectations.`);
                    return business.UserBiz.getUserInformation(undefined);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value undefined is not valid as an id.', `Reason message didn't meet the expectations.`);
                    return business.UserBiz.getUserInformation(false);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value false is not valid as an id.', `Reason message didn't meet the expectations.`);
                    return business.UserBiz.getUserInformation(null);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value null is not valid as an id.', `Reason message didn't meet the expectations.`);
                    return business.UserBiz.getUserInformation(NaN);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value NaN is not valid as an id.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should reject when inexistent user with id -12 is requested', (done: MochaDone) => {
            business.UserBiz.getUserInformation(-12)
                .catch((reason: string) => {
                    chai.assert(reason === 'It was not possible to acquire the information for id -12.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should reject when user with non-integer id \'goudalicious\' is requested', (done: MochaDone) => {
            business.UserBiz.getUserInformation('goudalicious')
                .catch((reason: string) => {
                    chai.assert(reason === 'The value goudalicious is not valid as an id.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

    });

    /**
     * Function createUser
     */
    describe('createUser', () => {

        it('should successfully store a valid user', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .then((stored: MappedUser) => {
                    chai.assert(stored.id === 5, `Id ${stored.id} is not equal to 5`);
                    chai.assert(stored.name === 'Bill', `Name ${stored.name} is not equal to 'Bill'`);
                    chai.assert(stored.username === 'spamElgoog', `Username ${stored.username} is not equal to 'spamElgoog'.`);
                    chai.assert(typeof stored.created === 'object', `Typeof created ${typeof stored.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should not store an invalid user whose name is missing', (done: MochaDone) => {
            let userWannabe: any = {
                username: 'spamElgoog',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the body of this request did not meet the expectations.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store an invalid user whose username is missing', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the body of this request did not meet the expectations.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store an invalid user whose password is missing', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the body of this request did not meet the expectations.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store a valid user whose username already has been used', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'breich',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the username breich already exists.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should successfully store a valid user whose name has already been used', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bob Dylan',
                username: 'spamElgoog',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .then((stored: MappedUser) => {
                    chai.assert(stored.id === 5, `Id ${stored.id} is not equal to 5`);
                    chai.assert(stored.name === 'Bob Dylan', `Name ${stored.name} is not equal to 'Bob Dylan'`);
                    chai.assert(stored.username === 'spamElgoog', `Username ${stored.username} is not equal to 'spamElgoog'.`);
                    chai.assert(typeof stored.created === 'object', `Typeof created ${typeof stored.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should successfully store a valid user whose password has already been used', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: 'ohhoneyhoney'
            };
            business.UserBiz.createUser(userWannabe)
                .then((stored: MappedUser) => {
                    chai.assert(stored.id === 5, `Id ${stored.id} is not equal to 5`);
                    chai.assert(stored.name === 'Bill', `Name ${stored.name} is not equal to 'Bill'`);
                    chai.assert(stored.username === 'spamElgoog', `Username ${stored.username} is not equal to 'spamElgoog'.`);
                    chai.assert(typeof stored.created === 'object', `Typeof created ${typeof stored.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should not store an invalid user whose username is gr@yh[]und which has invalid characters', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'gr@yh[]und',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the username doesn\'t meet the requirements.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store an invalid user whose username is bro which is too short', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'bro',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the username doesn\'t meet the requirements.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store an invalid user whose username is trololololololololololohohohohoho which is too long', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'trololololololololololohohohohoho',
                password: 'viiithethirdfromfifth'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the username doesn\'t meet the requirements.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should not store an invalid user whose password has more than 50 characters', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: '123456789012345678901234567890123456789012345678901'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the password doesn\'t meet the requirements.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should successfully store a valid user whose password has 49 characters', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: '1234567890123456789012345678901234567890123456789'
            };
            business.UserBiz.createUser(userWannabe)
                .then((stored: MappedUser) => {
                    chai.assert(stored.id === 5, `Id ${stored.id} is not equal to 5`);
                    chai.assert(stored.name === 'Bill', `Name ${stored.name} is not equal to 'Bill'`);
                    chai.assert(stored.username === 'spamElgoog', `Username ${stored.username} is not equal to 'spamElgoog'.`);
                    chai.assert(typeof stored.created === 'object', `Typeof created ${typeof stored.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should not store an invalid user whose password has less than 8 characters', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: '1234567'
            };
            business.UserBiz.createUser(userWannabe)
                .catch((reason: string) => {
                    chai.assert(reason === 'Invalid User: the password doesn\'t meet the requirements.', `Reason message didn't meet the expectations.`);
                    done();
                });
        });

        it('should successfully store a valid user whose password has 8 characters', (done: MochaDone) => {
            let userWannabe: any = {
                name: 'Bill',
                username: 'spamElgoog',
                password: '12345678'
            };
            business.UserBiz.createUser(userWannabe)
                .then((stored: MappedUser) => {
                    chai.assert(stored.id === 5, `Id ${stored.id} is not equal to 5`);
                    chai.assert(stored.name === 'Bill', `Name ${stored.name} is not equal to 'Bill'`);
                    chai.assert(stored.username === 'spamElgoog', `Username ${stored.username} is not equal to 'spamElgoog'.`);
                    chai.assert(typeof stored.created === 'object', `Typeof created ${typeof stored.created} is not equal to 'object'`);
                    done();
                });
        });

    });

    /**
     * Function deleteUser
     */
    describe('deleteUser', () => {

        it('should successfully return the deleted user with id 3', (done: MochaDone) => {
            business.UserBiz.deleteUser(3)
                .then((deleted: MappedUser) => {
                    chai.assert(deleted.id === 3, `Id ${deleted.id} is not equal to 3`);
                    chai.assert(deleted.name === 'Brendan Eich', `Name ${deleted.name} is not equal to 'Brendan Eich'`);
                    chai.assert(deleted.username === 'breich', `Username ${deleted.username} is not equal to 'breich'.`);
                    chai.assert(typeof deleted.created === 'object', `Typeof created ${typeof deleted.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should successfully return the deleted user with id 2', (done: MochaDone) => {
            business.UserBiz.deleteUser(2)
                .then((deleted: MappedUser) => {
                    chai.assert(deleted.id === 2, `Id ${deleted.id} is not equal to 2`);
                    chai.assert(deleted.name === 'Nick Cage', `Name ${deleted.name} is not equal to 'Nick Cage'`);
                    chai.assert(deleted.username === 'cageynick_77', `Username ${deleted.username} is not equal to 'cageynick_77'.`);
                    chai.assert(typeof deleted.created === 'object', `Typeof created ${typeof deleted.created} is not equal to 'object'`);
                    done();
                });
        });

        it('should reject when deletion of inexistent user with id 12 is requested', (done: MochaDone) => {
            business.UserBiz.deleteUser(12)
                .catch((reason: string) => {
                    chai.assert(reason === 'No user with id 12 could be found.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

        it('should reject when id is 0, undefined, false, NaN or null', (done: MochaDone) => {
            business.UserBiz.deleteUser(0)
                .catch((reason: string) => {
                    chai.assert(reason === 'The value 0 is not valid as an id.', `Reason message didn't meet the expectations`);
                    return business.UserBiz.deleteUser(undefined);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value undefined is not valid as an id.', `Reason message didn't meet the expectations`);
                    return business.UserBiz.deleteUser(false);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value false is not valid as an id.', `Reason message didn't meet the expectations`);
                    return business.UserBiz.deleteUser(NaN);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value NaN is not valid as an id.', `Reason message didn't meet the expectations`);
                    return business.UserBiz.deleteUser(null);
                })
                .catch((reason: string) => {
                    chai.assert(reason === 'The value null is not valid as an id.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

        it('should reject when deletion of inexistent user with id -12 is requested', (done: MochaDone) => {
            business.UserBiz.deleteUser(-12)
                .catch((reason: string) => {
                    chai.assert(reason === 'No user with id -12 could be found.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

        it('should reject when deletion of user with non-integer id \'goudalicious\' is requested', (done: MochaDone) => {
            business.UserBiz.deleteUser('goudalicious')
                .catch((reason: string) => {
                    chai.assert(reason === 'The value goudalicious is not valid as an id.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

        it('should reject when deletion of superadmin user is requested', (done: MochaDone) => {
            business.UserBiz.deleteUser(1)
                .catch((reason: string) => {
                    chai.assert(reason === 'The superuser cannot be deleted.', `Reason message didn't meet the expectations`);
                    done();
                });
        });

    });

});