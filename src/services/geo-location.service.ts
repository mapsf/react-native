import EventEmitter from 'EventEmitter';
import Mapbox from '@mapbox/react-native-mapbox-gl';

export default new class GeoLocationService {

    eventEmitter: EventEmitter;

    private readonly options = {
        enableHighAccuracy: true,
        timeout: 5000,
    };

    private watcherId: number;

    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    start(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const isGranted = await Mapbox.requestAndroidLocationPermissions();

                if (!isGranted) {
                    reject(new Error('Location permissions were not granted'));
                } else {
                    navigator.geolocation.getCurrentPosition(
                        (position: Position) => {
                            this.eventEmitter.emit('position', position);
                        },
                        (error) => {
                            reject(error);
                        },
                        this.options,
                    );
                    this.watcherId = navigator.geolocation.watchPosition((position: Position) => {
                        this.eventEmitter.emit('position', position);
                    }, (positionError: PositionError) => {
                        reject(positionError.message);
                    }, this.options);
                }
            } catch (e) {
                reject(e)
            }
        });
    }

    stop() {
        navigator.geolocation.clearWatch(this.watcherId);
    }
}
