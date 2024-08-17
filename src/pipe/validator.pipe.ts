import type { ValidationError } from "@nestjs/common";

import { Injectable, ValidationPipe, HttpStatus } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { validate } from "class-validator";

const getAllConstraints = (error: ValidationError[]): string[] => {
    const constraints: string[] = [];

    for (const thisError of error) {
        if (thisError.constraints) {
            const constraintValues = Object.values(thisError.constraints);
            constraints.push(...constraintValues);
        }

        if (thisError.children) {
            const childConstraints = getAllConstraints(thisError.children);
            constraints.push(...childConstraints);
        }
    }

    return constraints;
};

@Injectable()
export class Validator extends ValidationPipe {
    constructor() {
        super({
            exceptionFactory: (error: ValidationError[]): unknown => {
                const wsException = new WsException(getAllConstraints(error).toString());
                wsException.code = HttpStatus.UNPROCESSABLE_ENTITY;

                return wsException;
            },
        });
    }

    public internalValidate = async (instance: object): Promise<void> => {
        const error: ValidationError[] = await validate(instance);

        if (error.length > 0) {
            throw this.exceptionFactory(error);
        }
    };
}
