import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import TextField from '../components/TextField'; // Assuming you have a TextField component
import { API_URL, updateAPIUrl } from '../../apiConfig';

const Login = () => {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiModalVisible, setApiModalVisible] = useState(false);
  const [apiAddress, setApiAddress] = useState('');
  const [currentIP, setCurrentIP] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIPAddress = async () => {
      try {
        const ipAddress = await AsyncStorage.getItem('IPAddress');
        if (ipAddress !== null) {
          setCurrentIP(ipAddress);
          setApiAddress(ipAddress);
        } else {
          setCurrentIP('Not Set');
        }
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };
    fetchIPAddress();
    updateAPIUrl();
  }, []);

  const handleLoginPress = async () => {
    try {
      if (!usernameEmail.trim() || !password.trim()) {
        ToastAndroid.show(
          'Please provide necessary credentials.',
          ToastAndroid.SHORT,
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/Employee/Login?username=${usernameEmail.trim()}&password=${password.trim()}`,
      );
      if (!response.ok) {
        ToastAndroid.show(
          'Incorrect credentials. Please try again.',
          ToastAndroid.SHORT,
        );
        return;
      }
      const data = await response.json();
      let role = data.user_role.toLowerCase();
      if (role === 'supervisor') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Supervisor Dashboard', params: { data: data } }],
          }),
        );
      } else if (role === 'employee') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Employee Login', params: { data: data } }],
          }),
        );
      } else if (role === 'admin') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Admin Dashboard', params: { name: data.name } }],
          }),
        );
      } else {
        ToastAndroid.show(
          'Incorrect credentials. Please try again.',
          ToastAndroid.SHORT,
        );
        return;
      }
      setUsernameEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  const saveApiAddress = async () => {
    try {
      if (!apiAddress) {
        ToastAndroid.show('Please enter an IP address.', ToastAndroid.SHORT);
        return;
      }
      await AsyncStorage.setItem('IPAddress', apiAddress);
      setApiModalVisible(false);
      setCurrentIP(apiAddress);
      updateAPIUrl();
      ToastAndroid.show('IP Address changed successfully.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error saving API address to AsyncStorage:', error);
    }
  };

  const letHimGo = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Admin Dashboard', params: { name: 'Usama' } }],
      }),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/front.jpg')}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.titleStyle}>Industrial Watch</Text>
        </View>
        <View style={styles.formContainer}>
          <TextField
            style={styles.input}
            placeholder="Username or Email"
            value={usernameEmail}
            onChangeText={setUsernameEmail}
            placeholderTextColor="#A3A3A3"
          />
          <TextField
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#A3A3A3"
          />
          <View style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={handleLoginPress}
            >
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20', // Deep dark background
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 51,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 8,
  },
  titleStyle: {
    fontSize: 28,
    color: '#F2F2F2', // Lighter text color
    fontWeight: 'bold',
    margin: 10,
  },
  formContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#22242b', // Slightly lighter panel
    borderRadius: 16,
    padding: 22,
    marginTop: 14,
    shadowColor: '#000',
    elevation: 4,
  },
  input: {
    backgroundColor: '#23262F',
    color: '#F2F2F2',
    borderRadius: 8,
    padding: 14,
    marginTop: 10,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#3E5C76',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;