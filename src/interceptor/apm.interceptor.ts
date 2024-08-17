import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import type { IAlsData } from "@type/als";
import type { EventName } from "@type/eventName";

import { Injectable, HttpStatus } from "@nestjs/common";
import { alsService } from "@utility/als";
import { elasticAPM } from "@utility/apm";
import elasticApmNode from "elastic-apm-node";
import { Observable, Subscriber } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class APMInterceptor implements NestInterceptor {
    private readonly elasticApm: elasticApmNode.Agent;
    constructor() {
        this.elasticApm = elasticAPM;
    }

    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const event = context.switchToWs().getPattern() as EventName;
        const apmTransaction = this.elasticApm.startTransaction(event, "websocket");
        const traceID = apmTransaction.ids["trace.id"];
        const arg = context.switchToWs().getData() as unknown;
        const data: IAlsData = {
            event,
            apmTransaction,
            arg,
            responseData: {
                traceID,
                code: HttpStatus.OK,
            },
        };

        return new Observable((observer: Subscriber<unknown>) => {
            alsService.run(data, () => {
                next.handle().pipe(
                    tap(() => alsService.getStore().apmTransaction.end())
                ).subscribe(observer);
            });
        });
    };
}
