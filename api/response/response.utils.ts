import * as http from 'http';
import * as fs from 'fs';
import { Response } from './';

export namespace Utils {

    export function prepareResponse(response: http.ServerResponse, responseData: Response): PreparedResponse {
        response.writeHead(responseData.status, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(responseData));
        return new PreparedResponse(response);
    }

    export function prepareFileResponse(filename: string, length: number, response: http.ServerResponse) {
        response.writeHead(200,
            {
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': `${length}`
            }
        );
    }

    export function pipeReadStream(filepath: string, response: http.ServerResponse) {
        fs.createReadStream(filepath)
            .pipe(response);
    }

    export class PreparedResponse {

        private response: http.ServerResponse;

        constructor(response: http.ServerResponse) {
            this.response = response;
        }

        send() {
            this.response.end();
        }

    }

}
