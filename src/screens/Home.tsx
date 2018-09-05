import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Button} from 'react-native';
import api from '../api/index'
import {connect} from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import {listRepos} from './../redux/actions';
import NS from "../services/notification";
import SplashScreen from "react-native-splash-screen";
import auth from "../services/auth";
import config from "../utils/config";
import {getInstance} from '../services/web-socket.service'
import {UserInfoResponse} from "../api/responces";
import {AxiosResponse} from "axios";
import {Message} from "../utils/web-socket-client/types";
import {Client} from "../utils/web-socket-client";
import GeoLocationService from './../services/geo-location.service'
import ImageButton, {ImageType} from './../components/ImageButton'

Mapbox.setAccessToken(config.mapboxAccessToken);

type Props = {};

class Home extends Component<Props> {

    state = {
        user: null,
        // текущая позиция пользователя
        position: {
            longitude: 0,
            latitude: 0,
        },
    };

    private ws: Client = getInstance();

    async componentDidMount() {

        GeoLocationService.start().catch(err => {
            alert('error: ' + JSON.stringify(err));
        });

        GeoLocationService.eventEmitter.addListener('position', (position: Position) => {
            // alert('received ' + JSON.stringify(position.coords));
            this.setState({
                position: {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                }
            });
            this.ws.emit('position', this.state.position);
        });

        this.initWebSocketEvents();

        SplashScreen.hide();

        // this.props.listRepos('relferreira');
        api.getUserInfo()
            .then((res) => {
                this.setState({user: res});
            })
            .catch((err: any) => {
                NS.show(err.message);
            })
    }

    findMe = () => {
        this.ws.emit('ping', 'hello!');
    };

    openCharacterWindow = () => {
        alert(1);
    };

    private initWebSocketEvents() {
        this.ws.connect().then(() => {
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
        });
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
                    styleURL={config.mapStyle}
                    zoomLevel={15}
                    centerCoordinate={[this.state.position.longitude, this.state.position.latitude]}
                    style={styles.map}
                    logoEnabled={false}
                    compassEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    showUserLocation={false}
                >
                </Mapbox.MapView>
                <View style={styles.top}>
                    <ImageButton icon={ImageType.user} clickHandler={() => alert('user')}/>
                    <ImageButton icon={ImageType.settings} clickHandler={() => alert('settings')}/>
                </View>
                <View style={styles.bottom}>
                    <Button style={styles.button} title={'test1'} onPress={this.findMe}/>
                    <Button style={styles.button} title={'Персонаж'} onPress={this.openCharacterWindow}/>
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
