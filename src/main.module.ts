import type { ModuleMetadata, Type, Provider } from "@nestjs/common";

import { Module } from "@nestjs/common";

import { UserModule } from "./module/user/user.module";

const metadata: ModuleMetadata = {
    imports: [UserModule] as Type<unknown>[],
    controllers: [] as Type<unknown>[],
    providers: [] as Provider[],
    exports: [] as Provider[],
};

@Module(metadata)

export class MainModule { }
