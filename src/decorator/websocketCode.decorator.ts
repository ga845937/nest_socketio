import { HttpStatus } from "@nestjs/common";

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const WebSocketCode = (code: HttpStatus = HttpStatus.OK): MethodDecorator & ClassDecorator => {
    return (target: object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<unknown>) => {
        Reflect.defineMetadata("WebSocketCode", code, descriptor ? descriptor.value : target);
    };
};
