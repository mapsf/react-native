import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Button} from 'react-native';
import api from './../api'
import {connect} from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import {listRepos} from './../redux/actions';
import NS from "../services/notification";
import SplashScreen from "react-native-splash-screen";
import auth from "../services/auth";
import config from "../services/config";
import {getInstance} from '../services/web-socket.service'
import {UserInfoResponse} from "../api/responces";
import {AxiosResponse} from "axios";
import {Message} from "../utils/web-socket-client/types";
import {Client} from "../utils/web-socket-client";

Mapbox.setAccessToken(config('mapboxAccessToken'));

type Props = {};

class Home extends Component<Props> {

    state = {
        user: null,
        // текущая позиция пользователя
        position: {
            lng: 32.1047655,
            lat: 49.421955999999994,
        },
    };

    private ws: Client = getInstance();

    async componentDidMount() {

        this.ws.listen('connected', (message: Message) => {
            NS.show('[WS] connected');
        });

        this.ws.listen('disconnected', (message: Message) => {
            NS.show('[WS] disconnected  ' + message.originalEvent.code + ', ' + message.originalEvent.reason);
        });

        this.ws.listen('error', (message: Message) => {
            NS.show('[WS] error' + message.originalEvent.message);
        });

        this.ws.listen('ping', (message: Message) => {
            NS.show(`Вы получили ping сообщение. Содержимое: ${JSON.stringify(message.data)}`);
        });

        this.ws.connect();

        // const isGranted = await Mapbox.requestAndroidLocationPermissions();

        SplashScreen.hide();

        // navigator.geolocation.getCurrentPosition(
        //     (position) => alert(JSON.stringify(position)),
        //     (error) => alert(JSON.stringify(error)),
        //     {enableHighAccuracy: true, timeout: 20000},
        // );

        // this.props.listRepos('relferreira');
        api.getUserInfo()
            .then((res: AxiosResponse) => {
                const user: UserInfoResponse = res.data;
                this.setState({user: user});
            })
            .catch((err: any) => {
                NS.show(err.message);
            })
    }

    findMe() {
        this.ws.emit('ping', 'hello!');
    }

    render() {

        const {navigate} = this.props.navigation;

        const logout = () => {
            alert('logout');
            auth.destroyToken();
            navigate('Login');
        };

        return (
            <View style={styles.container}>
                <Mapbox.MapView
                    styleURL={'mapbox://styles/jilexandr/cjldyt0ip6kt72rp7v9kszc6b'}
                    zoomLevel={15}
                    centerCoordinate={[this.state.position.lng, this.state.position.lat]}
                    style={styles.map}
                    logoEnabled={false}
                    compassEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    showUserLocation={true}
                >
                </Mapbox.MapView>
                <View style={styles.top}>
                    <Button style={styles.button} title={'test1'} onPress={this.findMe}/>
                    <Button style={styles.button} title={'test2'} onPress={this.findMe}/>
                </View>
                <View style={styles.bottom}>
                    <Button style={styles.button} title={'test1'} onPress={this.findMe}/>
                    <Button style={styles.button} title={'test2'} onPress={this.findMe}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'row',
        // alignItems: 'flex-end',
    },
    map: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        // marginRight: 5,
    },
    top: {
        flex: 1,
        height: '50%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        // justifyContent: 'center',
    },
    bottom: {
        flex: 1,
        height: '50%',
        alignSelf: 'flex-end',
        flexDirection: 'row',
        // justifyContent: 'center',
    },
});

const mapStateToProps = state => {
    let repos = state.repos.map(repo => ({key: repo.id, ...repo}));
    return {
        repos,
    };
};

const mapDispatchToProps = {
    listRepos,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
