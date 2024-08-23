import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";

import { Injectable, HttpStatus } from "@nestjs/common";
import { alsService } from "@utility/als";
import { Observable, Subscriber } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        const handler = context.getHandler();
        const webSocketCode = Reflect.getMetadata("WebSocketCode", handler) as HttpStatus;

        return new Observable((observer: Subscriber<unknown>) => {
            next.handle().pipe(
                map((data: unknown) => {
                    const alsData = alsService.getStore();
                    alsData.responseData.data = data;
                    alsData.responseData.code = webSocketCode;
                    return {
                        event: alsData.event,
                        data: alsData.responseData,
                    };
                })
            ).subscribe(observer);
        });
    };
}
