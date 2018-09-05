import { AppRegistry, StatusBar } from 'react-native';
import config from './src/utils/config';
import App from './src/App';

StatusBar.setHidden(true);

AppRegistry.registerComponent(config.appName, () => App);
