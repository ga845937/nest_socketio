import { WebsocketExceptionsFilter } from "@filter/WebsocketException.filter";
import { APMInterceptor } from "@interceptor/apm.interceptor";
import { LoggerInterceptor } from "@interceptor/logger.interceptor";
import { ResponseTransformInterceptor } from "@interceptor/responseTransform.interceptor";
import { UseFilters, UseInterceptors, UsePipes } from "@nestjs/common";
import {
    WebSocketGateway,
    OnGatewayConnection,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from "@nestjs/websockets";
import { Validator } from "@pipe/validator.pipe";
import { UserEvent } from "@type/eventName";
import { Server, Socket } from "socket.io";

import { UserService } from "./provider/user.service";
import { ReadUserRequest, IReadUserResponse } from "./user.type";

//ResponseTransformInterceptor
@UseInterceptors(APMInterceptor, LoggerInterceptor, ResponseTransformInterceptor)
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(Validator)
@WebSocketGateway()
export class UserGateway implements OnGatewayConnection {
    @WebSocketServer()
    public server: Server;

    constructor(
        private readonly userService: UserService,
    ) { }

    public handleConnection(socket: Socket, ...args: unknown[]): void {
        // console.log(args);
    }

    @SubscribeMessage(UserEvent.ReadUser)
    public async readUser(
        @ConnectedSocket() socket: Socket,
        @MessageBody() data: ReadUserRequest
    ): Promise<IReadUserResponse> {
        return await this.userService.readUser(data);
    }
}
