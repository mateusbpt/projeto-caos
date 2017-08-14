import { Utils } from './response.utils';
import { UserMapper, MappedUser } from './response.mapper';

export {
    Utils,
    UserMapper,
    MappedUser
};

export interface Response {
    message: string;
    status: number;
}

export interface ErrorResponse extends Response {
}

export interface SuccessResponse extends Response {
    body: any;
}

export class ErrorResponseBuilder {

    private instance: ErrorResponse = {
        message: 'The URI you are trying to access either does not exist or has some sort of issue.',
        status: 400
    };

    static get(): ErrorResponseBuilder {
        return new ErrorResponseBuilder();
    }

    withMessage(message: string) {
        this.instance.message = message;
        return this;
    }

    withStatus(status: number) {
        this.instance.status = status;
        return this;
    }

    build(): ErrorResponse {
        return this.instance;
    }

}

export class SuccessResponseBuilder {

    private instance: SuccessResponse = {
        message: 'The operation was successfully executed.',
        status: 200,
        body: {}
    };

    static get(): SuccessResponseBuilder {
        return new SuccessResponseBuilder();
    }

    withMessage(message: string) {
        this.instance.message = message;
        return this;
    }

    withStatus(status: number) {
        this.instance.status = status;
        return this;
    }

    withBody(body: any) {
        this.instance.body = body;
        return this;
    }

    build(): SuccessResponse {
        return this.instance;
    }

}