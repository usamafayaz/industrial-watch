import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import TextField from '../components/TextField';
import {Text} from 'react-native-paper';
import {API_URL} from '../../apiConfig';

const AddEmployee = props => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  const employee = props.route.params.employeeDetail;
  const {employee_id} = props.route.params.employee;

  useEffect(() => {
    setName(employee.name);
    setUsername(employee.username);
    setPassword(employee.password);
    setImage(employee.image);
  }, []);

  const updateProfile = async () => {
    if (!name || !username || !password) {
      ToastAndroid.show('Please Fill all the fields.', ToastAndroid.SHORT);
      return;
    }
    const data = {
      id: employee_id,
      name: name,
      username: username,
      password: password,
    };
    try {
      const response = await fetch(
        `${API_URL}/Employee/UpdateEmployeeProfile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        ToastAndroid.show('Information Updated.', ToastAndroid.SHORT);
        navigation.goBack({employee: employee});
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      ToastAndroid.show('Failed to update profile.', ToastAndroid.SHORT);
    }
  };

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <View style={styles.design}></View>
      <View style={styles.whiteDesign}></View>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          source={{
            uri: `${API_URL}/EmployeeImage/${employee_id}/${encodeURIComponent(
              image,
            )}`,
          }}
          style={styles.imageStyle}
        />
      </View>
      <View style={{width: '100%', alignItems: 'center', marginTop: 80}}>
        <Text style={styles.hintStyle}>Name</Text>
        <TextField
          placeHolder=""
          value={name}
          onChangeText={text => setName(text)}
        />
        <Text style={styles.hintStyle}>Username</Text>
        <TextField
          placeHolder=""
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text style={styles.hintStyle}>Password</Text>
        <TextField
          placeHolder=""
          eyeIcon={true}
          value={password}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Update Profile" onPress={updateProfile} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
    marginBottom: 120,
  },
  imageContainer: {
    backgroundColor: '#c5e3e1',
    padding: 30,
    borderRadius: 600,
    position: 'absolute',
    top: 90,
    height: 100,
    width: 100,
  },
  design: {
    backgroundColor: '#2196F3',
    height: 115,
    width: '100%',
    borderBottomRightRadius: 140,
    borderBottomLeftRadius: 140,
    marginBottom: 55,
  },
  whiteDesign: {
    backgroundColor: 'white',
    borderRadius: 600,
    position: 'absolute',
    height: 112,
    width: 112,
    top: 84,
  },
  hintStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: '9%',
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 60,
    position: 'absolute',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: '8%',
    paddingTop: '2%',
  },
  headerContainer: {
    backgroundColor: '#2196F3',
    width: '100%',
  },
});

export default AddEmployee;
