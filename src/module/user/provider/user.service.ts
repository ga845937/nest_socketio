import { Injectable, HttpStatus } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

import { ReadUserRequest, IReadUserResponse } from "../user.type";

@Injectable()
export class UserService {
    public readUser = async (data: ReadUserRequest): Promise<IReadUserResponse> => {
        const response: IReadUserResponse = {
            id: "123",
            name: data.name,
        };

        if (response.name === "1") {
            const delay = (): Promise<void> => new Promise<void>((resolve: () => void) => setTimeout(resolve, 10000));
            await delay();
        }

        if (response.name === "2") {
            const wsException = new WsException("Not Found Error message");
            wsException.code = HttpStatus.NOT_FOUND;
            wsException.cause = new Error("Not Found");
            throw wsException;
        }

        return response;
    };
}
