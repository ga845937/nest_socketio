import type { HttpStatus } from "@nestjs/common";

declare module "@nestjs/websockets" {
    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    interface WsException {
        code: HttpStatus,
    }
}
