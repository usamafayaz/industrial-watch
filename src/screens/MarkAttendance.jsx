import React, {useState} from 'react';
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

const MarkAttendance = () => {
  const [loading, setLoading] = useState(false);

  const handleCameraPress = () => {
    const options = {
      mediaType: 'photo',
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
      mediaType: 'photo',
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
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    const uploadUrl = `${API_URL}/Employee/MarkAttendance`;

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
        console.log(result.message);
        ToastAndroid.show(result.message, ToastAndroid.LONG);
      } else {
        console.log(result.message);

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
          <TouchableOpacity onPress={handleCameraPress} style={styles.button}>
            <Icon name="camera-outline" size={60} color="black" />
            <Text style={styles.buttonText}>Capture Photo </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleBrowsePress} style={styles.button}>
            <Icon name="folder-open-outline" size={60} color="black" />
            <Text style={styles.buttonText}>Browse Photo</Text>
          </TouchableOpacity>
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
    justifyContent: 'center',
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
});

export default MarkAttendance;
