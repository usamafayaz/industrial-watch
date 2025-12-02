import React, {useState, useEffect} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextField from '../components/TextField';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {API_URL, updateAPIUrl} from '../../apiConfig';
const {width, height} = Dimensions.get('window');

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
      console.log(data);
      if (role === 'supervisor') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Supervisor Dashboard', params: {data: data}}],
          }),
        );
      } else if (role === 'employee') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Employee Login', params: {data: data}}],
          }),
        );
      } else if (role === 'admin') {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Admin Dashboard', params: {name: data.name}}],
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
        routes: [{name: 'Admin Dashboard', params: {name: 'Usama'}}],
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
            placeHolder="Username/Email"
            value={usernameEmail}
            onChangeText={setUsernameEmail}
          />
          <TextField
            placeHolder="Password"
            eyeIcon={true}
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.buttonWrapper}>
            <ButtonComponent title="Login" onPress={handleLoginPress} />
          </View>
        </View>
        <Modal isVisible={apiModalVisible}>
          <View style={styles.modalWrapper}>
            <Text style={styles.modalHeaderStyle}>Change IP Address</Text>
            <Text style={styles.hintText}>Current IP: {currentIP}</Text>
            <Text style={styles.hintText}>IP Address:</Text>
            <TextField
              placeHolder="Enter IP Address"
              value={apiAddress}
              onChangeText={setApiAddress}
              isNumeric={true}
            />
            <View style={styles.modalButtonWrapper}>
              <TouchableOpacity onPress={() => setApiModalVisible(false)}>
                <Text style={styles.cancelStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveApiAddress}>
                <Text style={styles.OKStyle}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableWithoutFeedback
          onPress={() => {
            setApiModalVisible(!apiModalVisible);
          }}>
          <View style={styles.IPButtonContainer}>
            <Text style={styles.IPButtonText}>IP Address</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
    marginBottom: height * 0.05,
  },
  image: {
    width: width * 0.8,
    height: height * 0.27,
  },
  titleStyle: {
    fontSize: width * 0.08,
    color: 'black',
    fontWeight: 'bold',
  },
  formContainer: {
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  IPButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  IPButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalHeaderStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
    alignSelf: 'flex-start',
    marginTop: '5%',
    marginLeft: '9%',
  },
  modalWrapper: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 300,
    width: 350,
    alignSelf: 'center',
    borderRadius: 30,
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    marginLeft: '43%',
    marginTop: '7%',
  },
  cancelStyle: {
    color: '#2196F3',
    marginRight: 10,
    paddingVertical: '5%',
  },
  OKStyle: {
    color: 'white',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  hintText: {
    alignSelf: 'flex-start',
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
    marginTop: 20,
  },
});

export default Login;