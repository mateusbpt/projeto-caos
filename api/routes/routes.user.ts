import * as express from 'express';
import * as Business from './../business';
import * as Middleware from './../middleware';
import * as Response from './../response';

export namespace UserRoutes {

    export function configureRoutes() {
        let router: express.Router = express.Router();
        router.get('/:userId', (request: express.Request, response: express.Response) => {
            Middleware.AuthenticationMiddleware.authenticate(request, response, () => {
                Resources.getUser(request, response);
            });
        });
        router.post('/', (request: express.Request, response: express.Response) => {
            Resources.createUser(request, response);
        });
        router.delete('/:userId', (request: express.Request, response: express.Response) => {
            Middleware.AuthenticationMiddleware.authenticate(request, response, () => {
                Resources.deleteUser(request, response);
            });
        });
        return router;
    }

    namespace Resources {

        export function getUser(request: express.Request, response: express.Response) {
            if (!request || !request.params) {
                Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder
                    .get()
                    .build());
                return response.end();
            }
            let userId = request.params.userId;
            Business.UserBiz.getUserInformation(userId)
                .then((userInfo: any) => {
                    Response.Utils.prepareResponse(response, Response.SuccessResponseBuilder.get()
                        .withBody(userInfo)
                        .build());
                    response.end();
                })
                .catch((error: string) => {
                    Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder.get()
                        .withMessage(error)
                        .build());
                    response.end();
                });
        }

        export function createUser(request: express.Request, response: express.Response) {
            if (!request || !request.body || !request.body.user) {
                Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder
                    .get()
                    .build());
                return response.end();
            }
            let user = request.body.user;
            Business.UserBiz.createUser(user)
                .then((createdUser: any) => {
                    Response.Utils.prepareResponse(response, Response.SuccessResponseBuilder.get()
                        .withBody({
                            createdUser: createdUser
                        })
                        .build());
                    response.end();
                })
                .catch((error: string) => {
                    Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder.get()
                        .withMessage(error)
                        .build());
                    response.end();
                });
        }

        export function deleteUser(request: express.Request, response: express.Response) {
            if (!request || !request.params) {
                Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder
                    .get()
                    .build());
                return response.end();
            }
            let userId = request.params.userId;
            Business.UserBiz.deleteUser(userId)
                .then((deleted: any) => {
                    Response.Utils.prepareResponse(response, Response.SuccessResponseBuilder.get()
                        .withBody(deleted)
                        .build());
                    response.end();
                })
                .catch((error: string) => {
                    Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder.get()
                        .withMessage(error)
                        .build());
                    response.end();
                });
        }

    }

}