import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import ToastAndroid from './src/utils/Toast';

// In development, default to the machine running the Expo dev server,
// which is usually where the backend runs too.
const DEFAULT_IP = Constants.expoConfig?.hostUri?.split(':')[0] ?? '';

let API_URL = DEFAULT_IP ? `http://${DEFAULT_IP}:5000/api` : '';

const fetchIPAddress = async () => {
  try {
    const ipAddress = await AsyncStorage.getItem('IPAddress');
    if (ipAddress) {
      API_URL = `http://${ipAddress}:5000/api`;
    }
  } catch (error) {
    ToastAndroid.show('Error fetching IP address:', ToastAndroid.SHORT);
  }
};

fetchIPAddress();

const updateAPIUrl = async () => {
  await fetchIPAddress();
};

export {API_URL, DEFAULT_IP, updateAPIUrl};
