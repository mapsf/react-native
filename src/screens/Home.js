import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Alert} from 'react-native';
import api from './../services/api'
import {connect} from 'react-redux';
import Mapbox from '@mapbox/react-native-mapbox-gl';

import {listRepos} from './../redux/reducer';
import NS from "../services/notification";
import config from "../services/config";

type Props = {};

// Mapbox.setAccessToken(config('mapboxAccessToken'));

class Home extends Component<Props> {

    state = {
        user: null,
    };

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
            <View styles={styles.container}>
                <Text>{JSON.stringify(this.state.user)}</Text>
                {/*<Mapbox.MapView*/}
                {/*styleURL={Mapbox.StyleURL.Street}*/}
                {/*zoomLevel={15}*/}
                {/*centerCoordinate={[11.256, 43.770]}*/}
                {/*style={styles.container}*/}
                {/*>*/}
                {/*</Mapbox.MapView>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 50
    }
});

const mapStateToProps = state => {
    let storedRepositories = state.repos.map(repo => ({key: repo.id, ...repo}));
    return {
        repos: storedRepositories
    };
};

const mapDispatchToProps = {
    listRepos
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
