import config from './config'
import auth from './auth'

type Message = {
    type: string;
    data: any;
};

class Client {

    private _eventListenersMap: { [key: string]: Function[]; } = {};
    private _serverUrlAccessor: Function;
    private _ws: WebSocket | undefined;
    private connected: Boolean = false;

    constructor(serverUrlAccessor: Function) {
        this._serverUrlAccessor = serverUrlAccessor;
    }

    public async connect() {

        this.connected = true;

        const url = await this._serverUrlAccessor();

        this._ws = new WebSocket(url);

        console.log(`[WS] connecting to ${url}`);

        this._ws.onopen = () => this._callListeners({type: 'connected', data: null});
        this._ws.onmessage = (e) => this._callListeners(JSON.parse(e.data));
        this._ws.onerror = (e) => this._callListeners({type: 'error', data: e});
        this._ws.onclose = (e) => this._callListeners({type: 'disconnected', data: e});
    }

    public disconnect() {
        if (!this.connected) {
            return;
        }
        console.log(`[WS] disconnecting...`);
        this._ws.close();
    }

    public emit(eventType: string, data: any) {
        console.log(`[WS] emit eventType "${eventType}" with data "${JSON.stringify(data)}"`);
        if (this._ws.readyState !== 1) {
            throw new Error('[WS] Connection is not opened');
        }
        this._ws.send(JSON.stringify({
            type: eventType,
            data: data,
        }));
    }

    public on(eventType: string, callback: Function) {
        console.log(`[WS] on eventType "${eventType}"`);
        this._eventListenersMap[eventType] = (this._eventListenersMap[eventType] || []).concat([callback]);
    }

    private _callListeners(message: Message) {
        console.log(`[WS] _callListeners of type "${message.type}"`);
        const listeners = this._eventListenersMap[message.type];
        for (let key in listeners) {
            if (!listeners.hasOwnProperty(key)) continue;
            const callback = listeners[key];
            callback(message.data);
        }
    }

    // _clearListeners() {
    //     this._eventListenersMap = {};
    // }
}

const instance = new Client(async () => {
    const token = await auth.getToken();
    let url = config('websocketServer');
    if (token) {
        url += `?Authorization=${token}`;
    }
    return url;
});

export default instance;
