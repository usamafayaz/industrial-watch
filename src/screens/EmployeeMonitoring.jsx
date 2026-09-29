import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import Icon from '@expo/vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from '../utils/imagePicker';
import {API_URL} from '../../apiConfig';
import {useNavigation, useRoute} from '@react-navigation/native';
import SelectListComponent from '../components/SelectListComponent';

const EmployeeMonitoring = ({route}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [sectionsList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  useEffect(() => {
    fetchSection();
  }, []);
  const fetchSection = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Section/GetSpecialSection?employee_id=${route.params.employee.employee_id}`,
      );
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.id.toString(),
        value: item.name,
      }));
      setSectionList(formattedData);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch sections. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };
  const handleCameraPress = () => {
    const options = {
      mediaType: 'video',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          uploadFile(uri);
        }
      }
    });
  };

  const handleBrowsePress = () => {
    const options = {
      mediaType: 'video',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          uploadFile(uri);
        }
      }
    });
  };

  const uploadFile = async uri => {
    const formData = new FormData();
    formData.append('section_id', selectedSection);
    formData.append('files', {
      uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });

    const uploadUrl = `${API_URL}/Automation/PredictEmployeeViolation`;

    ToastAndroid.show('Uploading the file', ToastAndroid.LONG);
    setLoading(true);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      if (response.ok) {
        navigation.navigate('Violation Summary', {result});
      } else {
        ToastAndroid.show(
          result.message || 'Unknown error',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Upload failed:', error);
      ToastAndroid.show('Upload failed', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <>
          <View style={{width: '100%', marginTop: 100}}>
            <Text style={styles.hintText}>Section:</Text>
            <SelectListComponent
              setSelected={setSelectedSection}
              data={sectionsList}
              placeholder="Select Section"
            />
          </View>
          {selectedSection !== '' ? (
            <View style={styles.cameraContainer}>
              <TouchableOpacity
                onPress={handleCameraPress}
                style={styles.button}>
                <Icon name="camera-outline" size={60} color="black" />
                <Text style={styles.buttonText}>Record Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleBrowsePress}
                style={styles.button}>
                <Icon name="folder-open-outline" size={60} color="black" />
                <Text style={styles.buttonText}>Browse Video</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  cameraContainer: {
    marginTop: 100,
  },
  hintText: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
  },
});

export default EmployeeMonitoring;
