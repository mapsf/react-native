import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Button} from 'react-native';
import api from './../services/api'
import {connect} from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import {listRepos} from './../redux/actions';
import NS from "../services/notification";
import config from "../services/config";
import {on} from "../services/ws";

type Props = {};

Mapbox.setAccessToken(config('mapboxAccessToken'));

class Home extends Component<Props> {

    state = {
        user: null,
    };

    async componentWillMount() {

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

        const isGranted = await Mapbox.requestAndroidLocationPermissions();
        this.setState({
            isAndroidPermissionGranted: isGranted,
            isFetchingAndroidPermission: false,
        });
    }

    componentDidMount() {

        navigator.geolocation.getCurrentPosition(
            (position) => alert(JSON.stringify(position)),
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000},
        );

        // this.props.listRepos('relferreira');
        api.getUserInfo()
            .then(res => {
                this.setState({user: res.data});
            })
            .catch(err => {
                NS.show(err.message);
            })
    }

    render() {
        return (
            <View>
                <Mapbox.MapView
                    styleURL={'mapbox://styles/jilexandr/cjldyt0ip6kt72rp7v9kszc6b'}
                    zoomLevel={15}
                    centerCoordinate={[32.1047655, 49.421955999999994]}
                    style={styles.map}
                    logoEnabled={false}
                    compassEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    showUserLocation={true}
                >

                </Mapbox.MapView>
                <Button
                    onPress={() => alert('qwd')}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
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
