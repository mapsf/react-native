import {Client} from "../utils/web-socket-client";
import auth from "../services/auth";
import config from "../services/config";

let instance;

export function getInstance() {
    if (!instance) {
        instance = new Client(async () => {
            const token = await auth.getToken();
            return token ? (`${config('websocketServer')}?Authorization=${token}`) : config('websocketServer');
        });
    }
    return instance;
}
