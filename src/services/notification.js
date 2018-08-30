import Toast from "react-native-root-toast";

export default class NotificationService {
    static show(message) {
        return Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {
                // calls listen toast\`s appear animation start
            },
            onShown: () => {
                // calls listen toast\`s appear animation end.
            },
            onHide: () => {
                // calls listen toast\`s hide animation start.
            },
            onHidden: () => {
                // calls listen toast\`s hide animation end.
            }
        });
    }
}
