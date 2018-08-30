import axios from 'axios'
import config from './config'
import auth from "./auth";

function getUrl(config) {
    return config.baseURL ? config.url.replace(config.baseURL, '') : config.url;
}

const tokenInjector = async (config) => {
    const token = await auth.getToken();
    if (token) {
        config.headers.common['Authorization'] = token;
    }
    return config;
};

const requestLogger = (config) => {
    console.log(`[REQUEST STARTED] ${config.method.toUpperCase()} - ${getUrl(config)} -> ${JSON.stringify(config.data)}, ${JSON.stringify(config.headers.common)}`);
    return config
};

const responseLogger = (res) => {
    console.log(`[REQUEST FINISHED] ${res.status} - ${getUrl(res.config)} -> ${JSON.stringify(res.data)}`);
    return res;
};

const responseErrorLogger = (err) => {
    console.log(`[REQUEST FINISHED WITH ERROR] ${err.response.status} - ${getUrl(err.response.config)} -> ${JSON.stringify(err.response.data)}`);
    return Promise.reject(err);
};

const httpClient = axios.create({
    baseURL: config('apiServer'),
    timeout: 1000,
});

httpClient.interceptors.request.use(tokenInjector, err => Promise.reject(err));
httpClient.interceptors.request.use(requestLogger);
httpClient.interceptors.response.use(responseLogger, responseErrorLogger);

export default httpClient;
