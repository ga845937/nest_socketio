import { RedisAdapter } from "@adapter/redis.adapter";
import { webSocketPort } from "@env";
import { NestFactory } from "@nestjs/core";

import { MainModule } from "./main.module";

const main = async (): Promise<void> => {
    const app = await NestFactory.create(MainModule);

    const redisIoAdapter = new RedisAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    await app.listen(webSocketPort);
};

main();
