import type { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";

import { Injectable } from "@nestjs/common";
import { alsService } from "@utility/als";
import { responseLog } from "@utility/logger";
import { Observable, Subscriber } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    public intercept = (context: ExecutionContext, next: CallHandler): Observable<unknown> => {
        return new Observable((observer: Subscriber<unknown>) => {
            next.handle().pipe(
                tap(() => responseLog(alsService.getStore()))
            ).subscribe(observer);
        });
    };
}
