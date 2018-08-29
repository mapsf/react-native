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

const store = createStore(reducer, applyMiddleware(axiosMiddleware(http)));

const AppWithNavigationState = createStackNavigator({
        Login: {screen: LoginScreen},
        Home: {screen: HomeScreen},
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
};
