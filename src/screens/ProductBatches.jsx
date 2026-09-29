import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import Icon from '@expo/vector-icons/MaterialIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {downloadAndShare} from '../utils/download';
import ButtonComponent from '../components/ButtonComponent';
import {API_URL} from '../../apiConfig';

const ProductBatches = props => {
  const {product_number, name: product_name} = props.route.params.item;
  const [batchesList, setBatchesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchBatches();
    }, []),
  );
  const fetchBatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Production/GetAllBatches?product_number=${encodeURIComponent(
          product_number,
        )}`,
      );
      const data = await response.json();
      console.log(product_number);
      setBatchesList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const downloadImages = async productNumber => {
    try {
      ToastAndroid.show('Downloading has begun', ToastAndroid.SHORT);
      await downloadAndShare(
        `${API_URL}/Production/GetAllDefectedImages?product_number=${encodeURIComponent(
          productNumber,
        )}`,
        `${productNumber.replace(/[^\w-]/g, '_')}.zip`,
        'application/zip',
      );
    } catch (error) {
      console.error('Download failed:', error);
      ToastAndroid.show('Download Failed.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={product_name} />
      {loading ? (
        <ActivityIndicator animating={loading} style={{flex: 1}} size={30} />
      ) : (
        <>
          {batchesList.length === 0 ? (
            <Text style={styles.noBatchesText}>No batches found.</Text>
          ) : (
            <>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => {
                  downloadImages(product_number);
                }}>
                <Icon name="cloud-download" size={30} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>Defected Batches</Text>
              </TouchableOpacity>
              <FlatList
                style={{width: '100%', marginTop: 20}}
                data={batchesList}
                renderItem={({item}) => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={{
                          backgroundColor:
                            item.status === 1
                              ? 'rgba(256, 0, 0, 0.2)'
                              : item.status === 2
                                ? 'transparent'
                                : 'rgba(0, 256, 0, 0.2)',
                          marginHorizontal: 10,
                          borderRadius: 10,
                        }}
                        onPress={() => {
                          console.log(item, product_number);
                          navigation.navigate('Batch Detail', {
                            item,
                            product_number,
                          });
                        }}>
                        <View style={styles.BatchesContainer}>
                          <Text style={styles.productsStyle}>
                            {item.batch_number}
                          </Text>
                          <Icon
                            name="arrow-forward-ios"
                            size={20}
                            color="#555"
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={styles.horizontalLineStyle}></View>
                    </View>
                  );
                }}
              />
            </>
          )}
        </>
      )}
      <View style={styles.buttonWrapper}>
        <ButtonComponent
          title="Create Batch"
          onPress={() =>
            navigation.navigate('Add Batch', {product_name, product_number})
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  BatchesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 17,
    marginHorizontal: 28,
    paddingRight: 13,
  },
  horizontalLineStyle: {
    width: '90%',
    height: 0.5,
    backgroundColor: 'grey',
    alignSelf: 'center',
  },
  productsStyle: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500',
  },
  buttonWrapper: {
    alignSelf: 'center',
    width: '70%',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  noBatchesText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    fontStyle: 'italic',
    marginTop: '80%',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F4F4F',
    alignSelf: 'flex-end',
    marginRight: '5%',
    marginTop: '5%',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  downloadButtonText: {color: 'white', fontWeight: 'bold', marginLeft: 20},
});

export default ProductBatches;
