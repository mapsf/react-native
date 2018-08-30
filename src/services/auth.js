import {AsyncStorage} from 'react-native'

const TOKEN_KEY = 'jwt_token';

export default {
    /**
     *
     * @param token
     * @returns {Promise<any> | Promise}
     */
    storeToken(token) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(TOKEN_KEY, token, function () {
                resolve();
            });
        });
    },
    /**
     *
     * @returns {Promise<String>}
     */
    getToken() {
        return AsyncStorage.getItem(TOKEN_KEY).then((value) => {
            return value;
        });
    },
    /**
     *
     * @returns {Promise<any> | Promise}
     */
    destroyToken() {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(TOKEN_KEY, function () {
                resolve();
            });
        });
    },
};
