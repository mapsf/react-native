import httpClient from './http'

export default {
    loginUser: function (login, password) {
        return httpClient.post('/auth', {
            login: login,
            password: password,
        });
    },
    getUserInfo: function () {
        return httpClient.get('/me');
    },
}
