import axios from 'axios'
import config from '../utils/config'
import auth from "./auth";

// import {Promise} from "es6-promise";

function getUrl(c: any) {
    return c.baseURL ? c.url.replace(c.baseURL, '') : c.url;
}

const tokenInjector = async (c) => {
    const token = await auth.getToken();
    if (token) {
        c.headers.common['Authorization'] = token;
    }
    return c;
};

const requestLogger = (c: any) => {
    console.log(`[REQUEST STARTED] ${c.method.toUpperCase()} - ${getUrl(c)} -> ${JSON.stringify(c.data)}, ${JSON.stringify(c.headers.common)}`);
    return c
};

const responseLogger = (res: any) => {
    console.log(`[REQUEST FINISHED] ${res.status} - ${getUrl(res.config)} -> ${JSON.stringify(res.data)}`);
    return res;
};

const responseErrorLogger = (err: any) => {
    console.log(`[REQUEST FINISHED WITH ERROR] ${err.response.status} - ${getUrl(err.response.config)} -> ${JSON.stringify(err.response.data)}`);
    return Promise.reject(err);
};

const httpClient = axios.create({
    baseURL: config.apiServer,
    timeout: 1000,
});

httpClient.interceptors.request.use(tokenInjector, err => Promise.reject(err));
httpClient.interceptors.request.use(requestLogger);
httpClient.interceptors.response.use(responseLogger, responseErrorLogger);

export default httpClient;
