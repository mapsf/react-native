import config from './config'
import auth from './auth'

let ws;
let eventListenersMap = {};

function callListeners(message) {
    const listeners = eventListenersMap[message.type];
    for (let key in listeners) {
        if (!listeners.hasOwnProperty(key)) continue;
        const callback = listeners[key];
        callback(message.data);
    }
}

function clearListeners() {
    eventListenersMap = {};
}

export function connect() {

    console.log('[WS] connecting...');

    // clearListeners();

    ws = new WebSocket(`${config('websocketServer')}?Authorization=${auth.getToken()}`);

    ws.onopen = () => callListeners({type: 'connected', data: null});
    ws.onmessage = (e) => callListeners(JSON.parse(e.data));
    ws.onerror = (e) => callListeners({type: 'error', data: e});
    ws.onclose = (e) => callListeners({type: 'disconnected', data: e});
}

export function disconnect() {
    ws.close();
}

export function emit(eventType, data) {
    ws.send(JSON.stringify({
        type: eventType,
        data: data,
    }));
}

export function on(eventType, callback) {
    eventListenersMap[eventType] = (eventListenersMap[eventType] || []).concat([callback]);
}
