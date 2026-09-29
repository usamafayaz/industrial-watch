import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';
import {launchImageLibrary} from '../utils/imagePicker';
import ButtonComponent from '../components/ButtonComponent';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {useNavigation} from '@react-navigation/native';

const BatchDefectMonitoring = () => {
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [batchesList, setBatchesList] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [selectedProduct]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/Production/GetLinkedProducts`);
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.product_number.toString(),
        value: item.name,
      }));
      setProductList(formattedData);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Production/GetAllBatches?product_number=${encodeURIComponent(
          selectedProduct,
        )}`,
      );
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.batch_number.toString(),
        value: item.batch_number,
      }));
      setBatchesList(formattedData);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const startMonitoring = async () => {
    if (!selectedProduct || !selectedBatch || images.length === 0) {
      ToastAndroid.show('Please fill up all the fields.', ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('product_number', selectedProduct);
      formData.append('batch_number', selectedBatch);

      images.forEach((image, index) => {
        formData.append('images', {
          uri: image,
          name: `image_${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await fetch(`${API_URL}/Production/DefectMonitoring`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      ToastAndroid.show('Monitoring started successfully.', ToastAndroid.SHORT);
      if (response.ok) {
        navigation.navigate('Defects Summary', {result});
      } else {
        ToastAndroid.show('An error has occurred.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('An error has occurred ' + error, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const openImagePicker = () => {
    let options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
      selectionLimit: 100,
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
      setImages(response.assets.map(image => image.uri));
    });
  };

  return (
    <View style={styles.container}>
      <View style={{width: '100%'}}>
        <SelectListComponent
          setSelected={setSelectedProduct}
          data={productList}
          placeholder="Select Product"
        />
      </View>
      <View style={{width: '100%'}}>
        <SelectListComponent
          setSelected={setSelectedBatch}
          data={batchesList}
          placeholder="Select Batch"
        />
      </View>
      {images.length > 0 && (
        <View style={styles.swiperContainer}>
          <SwiperFlatList index={0}>
            {images.map((image, index) => (
              <View style={styles.slide} key={index}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: image,
                  }}
                  style={styles.imageStyle}
                />
              </View>
            ))}
          </SwiperFlatList>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <>
          <ButtonComponent title="Browse Images" onPress={openImagePicker} />
          <ButtonComponent title="Start Monitoring" onPress={startMonitoring} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    width: 393,
    height: 300,
    marginVertical: 20,
  },
  swiperContainer: {
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BatchDefectMonitoring;
