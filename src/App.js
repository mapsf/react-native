import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation';
import {connect, on} from './services/ws'

import LoginScreen from './screens/Login'
import HomeScreen from './screens/Home'
import {applyMiddleware, createStore} from "redux";
import reducer from "./redux/reducer";
import axiosMiddleware from 'redux-axios-middleware';
import http from "./services/http";
import {Provider} from "react-redux";
import NS from "./services/notification";

const store = createStore(reducer, applyMiddleware(axiosMiddleware(http)));

const AppWithNavigationState = createStackNavigator({
    Login: {screen: LoginScreen},
    Home: {screen: HomeScreen},
});

on('connected', () => {
    NS.show('[WS] connected');
});

on('disconnected', (event) => {
    NS.show('[WS] disconnected  ' + event.code + ', ' + event.reason);
});

on('error', (event) => {
    NS.show('[WS] error' + event.message);
});

connect();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
};
