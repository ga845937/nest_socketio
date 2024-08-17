import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { Module } from "@nestjs/common";

import { UserService } from "./provider/user.service";
import { UserGateway } from "./user.gateway";

const metadata: ModuleMetadata = {
    imports: [] as Type<unknown>[],
    controllers: [] as Type<unknown>[],
    providers: [UserGateway, UserService] as Provider[],
    exports: [] as Provider[],
};

@Module(metadata)

export class UserModule { }
