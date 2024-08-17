import type { HttpStatus } from "@nestjs/common";
import type { EventName } from "@type/eventName";
import type { Transaction } from "elastic-apm-node";

export interface IAlsData {
    event: EventName,
    apmTransaction: Transaction,
    arg: unknown,
    responseData: {
        traceID: string,
        code: HttpStatus,
        message?: string,
        data?: unknown,
    },
    requestError?: Error,
}
