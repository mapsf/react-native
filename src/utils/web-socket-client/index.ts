import {EventListener, InvalidServerEventFormat, Message, State, WebSocketClient} from "./types";

export class Client implements WebSocketClient {

    private _eventListenersMap: { [key: string]: EventListener[]; } = {};
    private _serverUrlProvider: Function;
    private instance: WebSocket | undefined;
    private readonly logger: Console;
    private readonly reconnectingTimeout = 2000;

    private state: State = State.NOT_INITIALIZED;

    constructor(serverUrlAccessor: Function) {
        this._serverUrlProvider = serverUrlAccessor;
        this.logger = console;
    }

    // connect to the server
    public async connect(): void {

        this.state = State.INITIALIZED;

        const url = await this._serverUrlProvider();

        this.instance = new WebSocket(url);

        this.log(`Connecting to the server: ${url}`);

        this.instance.onopen = () => {
            this.state = State.CONNECTED;
            this._callListeners({type: 'connected'});
        };
        this.instance.onmessage = (event: MessageEvent) => {
            try {
                this._callListeners(this.parseServerEvent(event));
            } catch (e) {
                this.log(e.message);
            }
        };
        this.instance.onerror = (event) => this._callListeners({type: 'error', originalEvent: event});
        this.instance.onclose = (event) => {
            this.state = State.DISCONNECTED;
            this._callListeners({type: 'disconnected', originalEvent: event});
            setTimeout(() => {
                if (this.state === State.RECONNECTING) {
                    return;
                }
                this.log(`Reconnecting...`);
                this.state = State.RECONNECTING;
                this.connect();
            }, this.reconnectingTimeout);
        };
    }

    // send message to the server
    public emit(eventType: string, data?: any): void {
        this.log(`Send message of type "${eventType}" with data "${JSON.stringify(data)}"`);
        this.instanceCreated(() => {
            if (this.instance.readyState !== 1) {
                this.log('Connection is not opened, message can not be sent');
                return;
            }
            this.instance.send(JSON.stringify({type: eventType, data: data}));
        });
    }

    // listen server messages
    public listen(eventType: string, callback: EventListener): void {
        this.log(`Subscribe for messages of type "${eventType}"`);
        this._eventListenersMap[eventType] = (this._eventListenersMap[eventType] || []).concat([callback]);
    }

    public disconnect(): void {
        this.log(`Disconnecting...`);
        this.instanceCreated(() => {
            this.instance.close();
        });
    }

    private instanceCreated(fn: Function) {
        if (!this.webSocketInstanceCreated()) {
            return;
        }
        fn();
    }

    private parseServerEvent(event: MessageEvent): Message {
        const message = <Message>JSON.parse(event.data);
        if (!message.type) {
            throw new InvalidServerEventFormat();
        }
        message.originalEvent = event;
        return message;
    }

    private webSocketInstanceCreated(): boolean {
        return this.instance instanceof WebSocket;
    }

    private _callListeners(message: Message) {
        this.log(`Received message of type "${message.type}" with data ${JSON.stringify(message.data)}`);
        const listeners = this._eventListenersMap[message.type];
        for (let key in listeners) {
            if (!listeners.hasOwnProperty(key)) continue;
            const callback = listeners[key];
            callback(message);
        }
    }

    private log(...args: any[]): void {
        args[0] = `[WS_CLIENT] ${args[0]}`;
        this.logger.log.apply(this.logger, args);
    }

    // _clearListeners() {
    //     this._eventListenersMap = {};
    // }
}
