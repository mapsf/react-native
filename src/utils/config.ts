interface Config {
    appName: string;
    apiServer: string;
    websocketServer: string;
    mapStyle: string;
    mapboxAccessToken: string;
}

export default <Config>{
    appName: "MapsPvp",
    apiServer: "http://192.168.0.101:8888",
    websocketServer: "ws://192.168.0.101:8888/io",
    mapStyle: "mapbox://styles/jilexandr/cjldyt0ip6kt72rp7v9kszc6b",
    mapboxAccessToken: "pk.eyJ1IjoiamlsZXhhbmRyIiwiYSI6ImNqa3A1NThmbTF0M2gza3BjbW1wd2t6cnIifQ.4GhUti8p5IEkay5qx4suBA",
};
