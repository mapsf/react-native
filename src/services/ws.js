import config from './config'
import auth from './auth'

class Client {

    _eventListenersMap = {};
    _serverUrlAccessor = null;
    _ws = null;

    constructor(serverUrlAccessor) {
        this._serverUrlAccessor = serverUrlAccessor;
    }

    _callListeners(message) {
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

    async connect() {

        const url = await this._serverUrlAccessor();

        this._ws = new WebSocket(url);

        console.log(`[WS] connecting to ${url}`);

        this._ws.onopen = () => this._callListeners({ type: 'connected', data: null });
        this._ws.onmessage = (e) => this._callListeners(JSON.parse(e.data));
        this._ws.onerror = (e) => this._callListeners({ type: 'error', data: e });
        this._ws.onclose = (e) => this._callListeners({ type: 'disconnected', data: e });
    }

    disconnect() {
        console.log(`[WS] disconnecting...`);
        this._ws.close();
    }

    emit(eventType, data) {
        console.log(`[WS] emit eventType "${eventType}" with data "${JSON.stringify(data)}"`);
        if (this._ws.readyState !== 1) {
            throw new Error('[WS] Connection is not opened');
        }
        this._ws.send(JSON.stringify({
            type: eventType,
            data: data,
        }));
    }

    on(eventType, callback) {
        console.log(`[WS] on eventType "${eventType}"`);
        this._eventListenersMap[eventType] = (this._eventListenersMap[eventType] || []).concat([callback]);
    }
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
