import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { alsService } from "@utility/als";
import { responseLog } from "@utility/logger";

@Catch()
export class WebsocketExceptionsFilter implements ExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void {
        const alsData = alsService.getStore();
        const responseData = alsData.responseData;

        responseData.code = HttpStatus.INTERNAL_SERVER_ERROR;
        responseData.message = "server error";

        if (exception instanceof WsException) {
            if (exception.cause) {
                alsData.requestError = exception.cause as Error;
            }
            if (exception.code) {
                responseData.code = exception.code;
            }

            const error = exception.getError();
            responseData.message = typeof error === "string" ? error : JSON.stringify(error);
        }
        else {
            alsData.requestError = exception as Error;
        }

        responseLog(alsData);

        const callback = host.getArgByIndex(2) as unknown;
        if (callback && typeof callback === "function") {
            alsData.apmTransaction.end();
            callback(responseData);
        }
    }
}
