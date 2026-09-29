import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import ToastAndroid from '../utils/Toast';
import PrimaryAppBar from '../components/PrimaryAppBar';
import Icon from '@expo/vector-icons/MaterialIcons';
import {API_URL} from '../../apiConfig';
import {downloadAndShare} from '../utils/download';

const BatchDetails = props => {
  const [batchData, setBatchData] = useState(null);

  // Function to fetch batch details
  const fetchBatchDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Production/GetBatchDetails?batch_number=${encodeURIComponent(
          props.route.params.item.batch_number,
        )}`,
      );
      const data = await response.json();
      console.log(data);
      setBatchData(data);
    } catch (error) {
      console.error('Error fetching batch details:', error);
    }
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  const downloadImages = async () => {
    const product_number = props.route.params.product_number;
    const batch_number = props.route.params.item.batch_number;
    try {
      ToastAndroid.show('Downloading has begun', ToastAndroid.SHORT);
      await downloadAndShare(
        `${API_URL}/Production/GetDefectedImagesOfBatch?product_number=${encodeURIComponent(
          product_number,
        )}&batch_number=${encodeURIComponent(batch_number)}`,
        `${batch_number.replace(/[^\w-]/g, '_')}.zip`,
        'application/zip',
      );
    } catch (error) {
      console.error('Download failed:', error);
      ToastAndroid.show('Download Failed.', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={props.route.params.item.batch_number} />
      {/* Check if batchData is available before rendering */}
      {batchData && (
        <>
          <View style={styles.rowStyle}>
            <Text style={[styles.hintText, {marginTop: 30}]}>Status:</Text>
            <Text
              style={[
                styles.statusStyle,
                {
                  backgroundColor:
                    batchData.status === 1
                      ? '#FF0000'
                      : batchData.status === 2
                        ? 'grey'
                        : 'green',
                },
              ]}>
              {batchData.status === 1
                ? 'Rejected'
                : batchData.status === 2
                  ? 'Pending'
                  : 'Accepted'}
            </Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.hintText}>Dated:</Text>
            <Text style={styles.valueText}>{batchData.date}</Text>
          </View>
          {/* Render other batch details similarly */}
          <View style={styles.rowStyle}>
            <Text style={styles.hintText}>Total Pieces:</Text>
            <Text style={styles.valueText}>{batchData.total_piece}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.hintText}>Defected Pieces:</Text>
            <Text style={styles.valueText}>{batchData.defected_piece}</Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.hintText}>Rejection Tolorence:</Text>
            <Text style={styles.valueText}>
              {batchData.rejection_tolerance}%
            </Text>
          </View>
          <View style={styles.rowStyle}>
            <Text style={styles.hintText}>Total Yield:</Text>
            <Text style={styles.valueText}>
              {batchData.batch_yield.toFixed(1)}%
            </Text>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={downloadImages}>
          <Icon name="cloud-download" size={30} color="#FFFFFF" />
          <Text style={styles.downloadButtonText}>Download Images</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  hintText: {
    fontSize: 20,
    color: 'grey',
    fontWeight: '500',
    marginHorizontal: 20,
    marginTop: 10,
  },
  valueText: {
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusStyle: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    color: '#FFFFFF',
    marginTop: 30,
    fontSize: 18,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: '6%',
    marginBottom: '6%',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F4F4F',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  downloadButtonText: {color: 'white', fontWeight: 'bold', marginLeft: 20},
});

export default BatchDetails;
