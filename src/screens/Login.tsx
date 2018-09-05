import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import api from '../api/index'
import auth from '../services/auth'
import NS from '../services/notification'
import SplashScreen from "react-native-splash-screen";
import {LoginResponse} from "../api/responces";
import {AxiosResponse} from "axios";

type Props = {};
export default class Login extends Component<Props> {

    state = {
        loading: false,
        login: 'alexandr',
        password: '1',
    };

    async componentDidMount() {
        const {navigate} = this.props.navigation;
        try {
            const token = await auth.getToken();
            if (token) {
                await api.validateToken();
                navigate('Home');
            } else {
                SplashScreen.hide();
            }
        } catch (e) {
            alert('can not validate token, reason: ' + e.message);
            SplashScreen.hide();
        }
    }

    render() {

        const {navigate} = this.props.navigation;

        const login = () => {
            this.setState({loading: true});
            api.loginUser(this.state.login, this.state.password)
                .then((res) => {
                    auth.storeToken(res.token).then(() => navigate('Home'));
                })
                .catch((err: any) => NS.show(err.message))
                .finally(() => this.setState({loading: false}))
        };

        if (this.state.loading) {
            return <ActivityIndicator size="large"/>
        } else {
            return (
                <View style={styles.container}>
                    <View>
                        <Text>PvpMaps</Text>
                        <TextInput style={styles.input} placeholder="Логин" value={this.state.login}
                                   onChangeText={(val) => this.setState({login: val})}/>
                        <TextInput style={styles.input} placeholder="Пароль" value={this.state.password}
                                   onChangeText={(val) => this.setState({password: val})}/>
                        <TouchableOpacity onPress={login}>
                            <View style={styles.button}>
                                <Text style={styles.inputText}>Войти</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#4672b8',
        padding: 20,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#315687',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFF',
    },
    inputText: {
        fontSize: 20,
        color: '#FFF',
        padding: 8,
    },
});
