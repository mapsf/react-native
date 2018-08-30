export type Message = {
    // event type, like "new_user"
    type: string;
    // any event data, like `{"user_name": "test"}`
    data?: any;
    originalEvent?: Event;
};

export enum State {
    NOT_INITIALIZED = 0,
    INITIALIZED,
    CONNECTED,
    DISCONNECTED,
    RECONNECTING,
}

export class InvalidServerEventFormat extends Error {
    constructor() {
        super(`Message, received from server has invalid format mismatched with "Message" type`);
    }
}

export type EventListener = (message: Message) => void;

export interface WebSocketClient {
    connect(): void;

    listen(type: string, callback: EventListener): void;

    emit(type: string, data?: any): void;

    disconnect(): void;
}
