import {AsyncStorage} from 'react-native'

const TOKEN_KEY = 'jwt_token';

export default {
    storeToken(token: string): Promise<void> {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(TOKEN_KEY, token, () => resolve());
        });
    },
    getToken(): Promise<any> {
        return AsyncStorage.getItem(TOKEN_KEY).then((value: any) => value);
    },
    destroyToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(TOKEN_KEY, () => resolve());
        });
    },
};
