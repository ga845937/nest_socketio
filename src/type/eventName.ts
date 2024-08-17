export const socketPath = "/nest-socketio/";

export enum UserEvent {
    ReadUser = "user:readUser",
}

export type EventName = UserEvent;
