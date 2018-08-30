import { AppRegistry, StatusBar } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

StatusBar.setHidden(true);

AppRegistry.registerComponent(appName, () => App);
