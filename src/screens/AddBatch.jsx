import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {StyleSheet} from 'react-native';
import TextField from '../components/TextField';
import {API_URL} from '../../apiConfig';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';

const AddBatch = props => {
  const [product_name, setProductName] = useState(
    props.route.params.product_name,
  );
  const [product_number, setProductNumber] = useState(
    props.route.params.product_number,
  );
  const [batchPerDay, setBatchPerDay] = useState('');
  const [materialList, setMaterialList] = useState([]);
  const [allStockList, setAllStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchProductFormula();
  }, []);

  useEffect(() => {
    if (props.route.params && props.route.params.selectedStocks) {
      const existingIndex = allStockList.findIndex(
        item =>
          item.raw_material_id ===
          props.route.params.selectedStocks.raw_material_id,
      );
      if (existingIndex !== -1) {
        // If the raw_material_id already exists, overwrite its stocks
        const updatedList = [...allStockList];
        updatedList[existingIndex] = props.route.params.selectedStocks;
        setAllStockList(updatedList);
      } else {
        // If the raw_material_id doesn't exist, add it to the list
        setAllStockList([...allStockList, props.route.params.selectedStocks]);
      }
    }
  }, [props.route.params]);

  const fetchProductFormula = async () => {
    const response = await fetch(
      `${API_URL}/Production/GetFormulaOfProduct?product_number=${encodeURIComponent(
        product_number,
      )}`,
    );
    const data = await response.json();
    setMaterialList(data);
  };

  const addBatch = async () => {
    if (batchPerDay === '' || allStockList.length === 0) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    } else if (allStockList.length !== materialList.length) {
      ToastAndroid.show('Incomplete Stock.', ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);

    const data = {
      batch_per_day: batchPerDay,
      product_number: product_number,
      stock_list: allStockList,
    };

    try {
      const response = await fetch(`${API_URL}/Production/AddBatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.message || 'Failed to add Batch',
          ToastAndroid.SHORT,
        );
      }
      setAllStockList([]);
    } catch (error) {
      console.error('Error adding Batch:', error);
      ToastAndroid.show('An unexpected error occurred', ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={product_name} />
      <Text style={styles.hintText}>Batch/Day</Text>
      <TextField
        placeHolder="e.g  200"
        value={batchPerDay}
        onChangeText={setBatchPerDay}
        isNumeric={true}
      />

      <View style={[styles.tableStyle, {width: '55%'}]}>
        <Text style={styles.headerStyle}>#</Text>
        <Text style={styles.headerStyle}>Material</Text>
        <Text style={styles.headerStyle}>Quantity</Text>
      </View>

      <FlatList
        data={materialList}
        renderItem={({item, index}) => {
          return (
            <View style={[styles.tableStyle, {width: '87%'}]}>
              <Text style={styles.columnStyle}>{index + 1}</Text>
              <Text style={styles.columnStyle}>{item.name}</Text>
              <Text style={styles.columnStyle}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Choose Stock', {
                    raw_material_id: item.raw_material_id,
                    product_name: product_name,
                  });
                }}>
                <Text style={styles.detailLink}>Choose Stock</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Add Batch" onPress={addBatch} />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      )}
    </View>
  );
};

export default AddBatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hintText: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
    marginTop: 10,
  },
  tableStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  columnStyle: {
    fontSize: 18,
    color: 'black',
  },
  headerStyle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  detailLink: {
    color: '#105F9E',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
