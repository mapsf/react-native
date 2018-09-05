import httpClient from '../services/http'
import {LoginResponse, UserInfoResponse} from "./responces";
import {AxiosResponse} from "axios";

export default {
    loginUser: function (login: string, password: string): Promise<LoginResponse> {
        return httpClient.post('/auth', {
            login: login,
            password: password,
        }).then((res: AxiosResponse) => res.data);
    },
    getUserInfo: function (): Promise<UserInfoResponse> {
        return httpClient.get('/me').then((res: AxiosResponse) => res.data);
    },
    validateToken() {
        return httpClient.post('/validate-token');
    },
}
