import {AsyncStorage} from 'react-native'

const TOKEN_KEY = 'jwt_token';

export default {
    storeToken(token) {
        // console.log(`storeToken: ${token}`);
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(TOKEN_KEY, token, function () {
                resolve();
            });
        });
    },
    getToken() {
        // console.log(`getToken`);
        AsyncStorage.getItem(TOKEN_KEY).then((value) => {
            return value;
        });
        return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzQ5Njc1NjIsImlhdCI6MTUzNDk2Mzk2MiwibG9naW4iOiJBTEVYQU5EUiIsInN1YiI6MX0.BtHPkVrwvqXtvI42VhPmfwCmGJcvzlRo3QhXvqdxv_kQtU2IpDX-i1LNaqLng0TXSm26M8MdBocucnFobUzroQ';
    },
    destroyToken() {
        // console.log(`destroyToken`);
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(TOKEN_KEY, function () {
                resolve();
            });
        });
    },
};
