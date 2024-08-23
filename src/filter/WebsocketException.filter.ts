import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { alsService } from "@utility/als";
import { responseLog } from "@utility/logger";
import { Socket } from "socket.io";

import { WebSocketException } from "./webSocket.exception";

@Catch()
export class WebsocketExceptionsFilter implements ExceptionFilter {
    public catch(exception: unknown, host: ArgumentsHost): void {
        const alsData = alsService.getStore();
        const responseData = alsData.responseData;

        responseData.code = HttpStatus.INTERNAL_SERVER_ERROR;
        responseData.message = "server error";

        if (exception instanceof WebSocketException) {
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

        alsData.apmTransaction.end();
        const socket = host.switchToWs().getClient<Socket>();
        socket.emit(alsData.event, responseData);
    }
}
