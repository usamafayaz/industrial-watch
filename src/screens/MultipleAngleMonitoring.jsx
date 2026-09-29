import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import {launchImageLibrary} from '../utils/imagePicker';
import {API_URL} from '../../apiConfig';
import ButtonComponent from '../components/ButtonComponent';
import SwiperFlatList from 'react-native-swiper-flatlist';

const MultipleAngleMonitoring = () => {
  const [images, setImages] = useState({
    front: null,
    back: null,
    sides: [],
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openImagePicker = angle => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
      selectionLimit: angle === 'sides' ? 4 : 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        ToastAndroid.show('User cancelled Image Picker', ToastAndroid.SHORT);
        return;
      }
      if (response.error) {
        ToastAndroid.show('Image Picker Error', ToastAndroid.SHORT);
        return;
      }
      if (response.assets) {
        if (angle === 'sides') {
          if (response.assets.length !== 4) {
            ToastAndroid.show(
              'Please select exactly 4 images',
              ToastAndroid.SHORT,
            );
            return;
          }
          setImages(prevImages => ({
            ...prevImages,
            sides: response.assets,
          }));
        } else {
          const selectedImage = response.assets[0];
          setImages(prevImages => ({
            ...prevImages,
            [angle]: selectedImage,
          }));
        }
      }
    });
  };

  const handleSubmit = async () => {
    const missingAngles = Object.keys(images).filter(
      angle =>
        (angle !== 'sides' && !images[angle]) ||
        (angle === 'sides' && images[angle].length !== 4),
    );

    if (missingAngles.length > 0) {
      ToastAndroid.show(
        `Please select images for: ${missingAngles.join(', ')}`,
        ToastAndroid.SHORT,
      );
      return;
    }

    const formData = new FormData();
    formData.append('front', {
      name: 'front.jpg',
      uri: images.front.uri,
      type: images.front.type,
    });
    formData.append('back', {
      name: 'back.jpg',
      uri: images.back.uri,
      type: images.back.type,
    });
    images.sides.forEach((sideImage, index) => {
      formData.append(`sides`, {
        name: `side${index + 1}.jpg`,
        uri: sideImage.uri,
        type: sideImage.type,
      });
    });

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/Production/AnglesMonitoring`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const result = await response.json();
      setResponse(result);
      setModalVisible(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.row}>
        <View style={styles.imagePickerContainer}>
          <ButtonComponent
            title="Select Front Image"
            onPress={() => openImagePicker('front')}
          />
          {images.front && (
            <Image source={{uri: images.front.uri}} style={styles.imageStyle} />
          )}
        </View>
        <View style={styles.imagePickerContainer}>
          <ButtonComponent
            title="Select Back Image"
            onPress={() => openImagePicker('back')}
          />
          {images.back && (
            <Image source={{uri: images.back.uri}} style={styles.imageStyle} />
          )}
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.imagePickerContainer}>
          <ButtonComponent
            title="Select 4 Side Images"
            onPress={() => openImagePicker('sides')}
          />
          {images['sides'].length > 0 && (
            <View style={styles.swiperContainer}>
              <SwiperFlatList index={0}>
                {images['sides'].map((image, index) => (
                  <View style={styles.slide} key={index}>
                    <Image
                      resizeMode="contain"
                      source={{
                        uri: image.uri,
                      }}
                      style={styles.imageStyle}
                    />
                  </View>
                ))}
              </SwiperFlatList>
            </View>
          )}
        </View>
      </View>
      <ButtonComponent title="Start Monitoring" onPress={handleSubmit} />
      {loading && <ActivityIndicator size="large" color="#2196F3" />}
      {response && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Defects Report</Text>
              <Text style={styles.keyStyle}>Status: {response.status}</Text>
              <Text style={styles.keyStyle}>
                Front Defects: {response.defects_report.front.join(', ')}
              </Text>
              <Text style={styles.keyStyle}>
                Back Defects: {response.defects_report.back.join(', ')}
              </Text>
              <Text style={styles.keyStyle}>Sides Defects:</Text>
              {response.defects_report.sides.map((side, index) => (
                <Text key={index} style={styles.keyStyle}>
                  Side {side.side}: {side.defect}
                </Text>
              ))}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  imagePickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  imageStyle: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
  swiperContainer: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    color: 'black',
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  keyStyle: {
    color: 'black',
    fontSize: 17,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MultipleAngleMonitoring;
