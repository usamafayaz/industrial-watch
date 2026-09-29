import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import TextField from '../components/TextField';
import Icon from '@expo/vector-icons/MaterialIcons';
import {launchImageLibrary} from '../utils/imagePicker';
import {API_URL} from '../../apiConfig';

const AddGuest = () => {
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const addGuest = async () => {
    if (!name || images.length === 0) {
      ToastAndroid.show(
        'Please fill the name and select images',
        ToastAndroid.SHORT,
      );
      return;
    }

    setLoading(true); // Show loading indicator when API call starts

    try {
      const formData = new FormData();
      formData.append('name', name);
      images.forEach((image, index) => {
        formData.append('files', {
          uri: image,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await fetch(`${API_URL}/Employee/AddGuest`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        ToastAndroid.show('Guest added successfully', ToastAndroid.SHORT);
        clearFields();
        navigation.goBack();
      } else {
        ToastAndroid.show(
          'Failed to add guest. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      ToastAndroid.show(
        'Failed to add guest. Please try again.',
        ToastAndroid.SHORT,
      );
    }

    setLoading(false);
  };

  const clearFields = () => {
    setName('');
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
    <View>
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
          <View style={styles.buttonWrapper}>
            <ButtonComponent title="Add Guest" onPress={addGuest} />
          </View>

          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonWrapper: {
    alignItems: 'center',
    width: '70%',
    height: 200,
    marginTop: '5%',
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

export default AddGuest;
