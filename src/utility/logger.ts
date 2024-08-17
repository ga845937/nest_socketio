import type { IAlsData } from "@type/als";
import type { EventName } from "@type/eventName";
import type { TransformableInfo } from "logform";

import { execSync } from "child_process";
import { join } from "path";

import { nodeEnv, logPath } from "@env";
import { name as projectName, version as projectVersion, } from "@packageJson";
import winston from "winston";
/* eslint-disable-next-line @typescript-eslint/naming-convention */
import DailyRotateFile from "winston-daily-rotate-file";

interface IVersion {
    projectName: string,
    projectVersion: string,
    branch: string,
    hash: string,
    subModule?: Record<string, IVersion>,
}

const version: IVersion = {
    projectName,
    projectVersion,
    branch: execSync("git branch --show-current", { encoding: "utf8" }).trim(),
    hash: execSync("git log --pretty=format:%h -n 1", { encoding: "utf8" }).trim(),
};

export interface ILogData {
    program: string,
    project: string,
    env: string,
    version: IVersion,
    event: EventName,
    traceID: string,
    time: number,
    arg: unknown,
    responseData: Record<string, unknown>,
    error?: Record<string, unknown>,
}

const logger = winston.createLogger({
    transports: [
        new DailyRotateFile({
            format: winston.format.printf((info: TransformableInfo) => JSON.stringify(info.message)),
            filename: join(logPath, `${projectName}-%DATE%.json`),
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxFiles: "3d",
        }),
    ],
});

const errorToJson = (error: Error): Record<string, unknown> => {
    return {
        name: error.name,
        message: error.message,
        stack: error.stack,
    };
};

export const responseLog = (alsData: IAlsData): void => {
    const responseLog: ILogData = {
        program: "nodejs",
        project: projectName,
        env: nodeEnv,
        version,
        event: alsData.event,
        traceID: alsData.responseData.traceID as string,
        time: +new Date(),
        arg: alsData.arg,
        responseData: alsData.responseData,
    };

    if (alsData.requestError) {
        responseLog.error = errorToJson(alsData.requestError);
    }

    logger.info(responseLog);
};
