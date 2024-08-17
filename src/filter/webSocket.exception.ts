import type { HttpStatus } from "@nestjs/common";

import { WsException } from "@nestjs/websockets";

export class WebSocketException extends WsException {
    constructor(
        public readonly code: HttpStatus,
        error: string | object,
        public readonly cause?: Error,
    ) {
        super(error);
    }
}
