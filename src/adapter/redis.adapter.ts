import type { ServerOptions, Server } from "socket.io";

import { redisStreamURI } from "@env";
import { socketPath } from "@env";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { createClient } from "redis";

export class RedisAdapter extends IoAdapter {
    private adapterConstructor: ReturnType<typeof createAdapter>;

    public async connectToRedis(): Promise<void> {
        const client = createClient({ url: redisStreamURI });
        await client.connect();
        this.adapterConstructor = createAdapter(client);
    }

    public createIOServer(port: number, options?: ServerOptions): unknown {
        options.cors = { origin: "*" };
        options.transports = ["websocket"];
        options.path = socketPath;
        const server = super.createIOServer(port, options) as Server;
        server.adapter(this.adapterConstructor);
        return server;
    }
}
