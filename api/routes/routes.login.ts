import * as express from 'express';
import * as Response from './../response';
import * as Business from './../business';

export namespace LoginRoutes {

    export function configureRoutes() {
        let loginRouter: express.Router = express.Router();
        loginRouter.post('/', (request: express.Request, response: express.Response) => {
            Resources.login(request, response);
        });
        return loginRouter;
    }

    namespace Resources {

        export function login(request: express.Request, response: express.Response) {
            if (!request || !request.body || !request.body.login) {
                Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder
                    .get()
                    .build());
                return response.end();
            }
            let login = request.body.login;
            Business.LoginBiz.login(login)
                .then((loginInfo: any) => {
                    Response.Utils.prepareResponse(response, Response.SuccessResponseBuilder.get()
                        .withBody(loginInfo)
                        .build());
                    response.end();
                })
                .catch((error: any) => {
                    Response.Utils.prepareResponse(response, Response.ErrorResponseBuilder.get()
                        .withMessage(error)
                        .build());
                    response.end();
                });
        }

    }
}