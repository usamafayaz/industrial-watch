import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import TextField from '../components/TextField';
import {RadioButton} from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from '../utils/imagePicker';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';

const AddEmployee = () => {
  const [sectionsList, setSectionList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [checkedGender, setCheckedGender] = useState('Male');
  const [checkedJobType, setCheckedJobType] = useState('Full-Time');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading indicator

  useEffect(() => {
    fetchData(`${API_URL}/Section/GetAllSections?status=${1}`, setSectionList);
    fetchData(`${API_URL}/Employee/GetAllJobRoles`, setRolesList);
  }, []);

  const fetchData = async (url, setter) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.id.toString(),
        value: item.name,
      }));
      setter(formattedData);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const addEmployee = async () => {
    if (
      !name ||
      !username ||
      !password ||
      !salary ||
      !selectedSection ||
      !selectedRole ||
      images.length === 0
    ) {
      ToastAndroid.show(
        'Please fill all fields and select images',
        ToastAndroid.SHORT,
      );
      return;
    }

    setLoading(true); // Show loading indicator when API call starts

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('username', username);
      formData.append('password', password);
      formData.append('salary', salary);
      formData.append('section_id', selectedSection);
      formData.append('job_role_id', selectedRole);
      formData.append('gender', checkedGender);
      formData.append('job_type', checkedJobType);

      images.forEach((image, index) => {
        formData.append('files', {
          uri: image,
          name: `image_${index}.jpg`, // You can adjust the file name as needed
          type: 'image/jpeg',
        });
      });

      const response = await fetch(`${API_URL}/Employee/AddEmployee`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        ToastAndroid.show('Employee added successfully', ToastAndroid.SHORT);
        clearFields();
        navigation.goBack();
      } else {
        ToastAndroid.show(
          'Failed to add employee. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      ToastAndroid.show(
        'Failed to add employee. Please try again.',
        ToastAndroid.SHORT,
      );
    }

    setLoading(false); // Hide loading indicator after API call completes
  };

  const clearFields = () => {
    setName('');
    setUsername('');
    setPassword('');
    setSalary('');
    setSelectedRole('');
    setSelectedSection('');
    setCheckedGender('Male');
    setCheckedJobType('Full-Time');
    setImages([]);
  };

  const openImagePicker = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
      selectionLimit: 10,
    };

    launchImageLibrary(options, response => {
      if (!response) {
        console.log('Invalid response from image picker');
        return;
      }
      if (response.didCancel) {
        ToastAndroid.show('User cancelled Image Picker', ToastAndroid.SHORT);
        return;
      }
      if (response.assets && response.assets.length < 5) {
        ToastAndroid.show(
          'Please select at least 5 images',
          ToastAndroid.SHORT,
        );
        return;
      }
      if (response.assets && response.assets.length > 10) {
        ToastAndroid.show('You can select up to 10 images', ToastAndroid.SHORT);
        return;
      }
      if (
        response.assets &&
        response.assets.length >= 5 &&
        response.assets.length <= 10
      ) {
        // If between 5 and 10 images are selected, set the images
        setImages(response.assets.map(image => image.uri));
      }
    });
  };

  const renderImageContent = () => {
    if (images.length > 0) {
      return (
        <Image
          source={{uri: images[0]}}
          style={{
            width: 100,
            height: 100,
            borderRadius: 60,
            position: 'absolute',
          }}
        />
      );
    } else {
      return (
        <Icon
          name="add-a-photo"
          size={35}
          color="black"
          onPress={() => {
            openImagePicker();
          }}
        />
      );
    }
  };

  const navigation = useNavigation();
  return (
    <ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.design}></View>
          <View style={styles.whiteDesign}></View>
          <View style={styles.imageContainer}>{renderImageContent()}</View>

          <TextField
            placeHolder="Name"
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextField
            placeHolder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextField
            placeHolder="Password"
            eyeIcon={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TextField
            placeHolder="Salary"
            value={salary}
            isNumeric={true}
            onChangeText={text => setSalary(text)}
          />
          <View style={{width: '100%'}}>
            <SelectListComponent
              setSelected={setSelectedSection}
              data={sectionsList}
              placeholder="Select Section"
            />
          </View>
          <View style={{width: '100%'}}>
            <SelectListComponent
              setSelected={setSelectedRole}
              data={rolesList}
              placeholder="Select Role"
            />
          </View>
          <View style={styles.radioContainer}>
            <Text style={styles.titleStyle}>Gender</Text>
            <View style={styles.rowContainer}>
              <RadioButton
                value="Male"
                status={checkedGender === 'Male' ? 'checked' : 'unchecked'}
                onPress={() => setCheckedGender('Male')}
                color="#2196F3"
              />
              <Text style={styles.optionStyle}>Male</Text>
              <RadioButton
                value="Female"
                status={checkedGender === 'Female' ? 'checked' : 'unchecked'}
                onPress={() => setCheckedGender('Female')}
                color="#2196F3"
              />
              <Text style={styles.optionStyle}>Female</Text>
            </View>
          </View>

          <View style={styles.radioContainer}>
            <Text style={styles.titleStyle}>Job Type</Text>
            <View style={styles.rowContainer}>
              <RadioButton
                value="Full-Time"
                status={
                  checkedJobType === 'Full-Time' ? 'checked' : 'unchecked'
                }
                onPress={() => setCheckedJobType('Full-Time')}
                color="#2196F3"
              />
              <Text style={styles.optionStyle}>Full Time</Text>
              <RadioButton
                value="Part-Time"
                status={
                  checkedJobType === 'Part-Time' ? 'checked' : 'unchecked'
                }
                onPress={() => setCheckedJobType('Part-Time')}
                color="#2196F3"
              />
              <Text style={styles.optionStyle}>Part Time</Text>
            </View>
          </View>

          <View style={styles.buttonWrapper}>
            <ButtonComponent title="Add" onPress={addEmployee} />
          </View>

          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
  },

  titleStyle: {
    color: 'black',
    marginLeft: '9%',
    marginVertical: '4%',
    fontSize: 19,
    fontWeight: 'bold',
  },
  optionStyle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 10,
    width: 100,
  },
  radioContainer: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  design: {
    backgroundColor: '#2196F3',
    height: 70,
    width: '100%',
    borderBottomRightRadius: 100,
    borderBottomLeftRadius: 100,
    marginBottom: 65,
  },
  whiteDesign: {
    backgroundColor: 'white',
    borderRadius: 600,
    position: 'absolute',
    height: 112,
    width: 112,
    top: 20,
  },
  imageContainer: {
    backgroundColor: '#c5e3e1',
    padding: 30,
    borderRadius: 110,
    position: 'absolute',
    top: 26,
    height: 100,
    width: 100,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default AddEmployee;
