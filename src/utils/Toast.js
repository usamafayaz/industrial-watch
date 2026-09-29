import {Alert, Platform, ToastAndroid} from 'react-native';

// Drop-in replacement for ToastAndroid that also works on iOS.
const Toast = {
  SHORT: ToastAndroid.SHORT ?? 0,
  LONG: ToastAndroid.LONG ?? 1,
  show(message, duration) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(String(message), duration);
    } else {
      Alert.alert('', String(message));
    }
  },
};

export default Toast;
