import {Sex} from "../types";

export interface UserInfoResponse {
    id: number;
    login: string;
    level: number;
    sex: Sex;
}

export interface LoginResponse {
    token: string;
}
