import type { IAlsData } from "@type/als";

import { AsyncLocalStorage } from "node:async_hooks";

class AlsService {
    private readonly als: AsyncLocalStorage<IAlsData>;

    constructor() {
        this.als = new AsyncLocalStorage<IAlsData>();
    }

    public run(data: IAlsData, callback: () => void): void {
        this.als.run(data, callback);
    }

    public getStore(): IAlsData {
        return this.als.getStore();
    }
}

export const alsService = new AlsService();
