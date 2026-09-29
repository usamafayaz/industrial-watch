import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import CheckBox from 'expo-checkbox';
import {API_URL} from '../../apiConfig';
import PrimaryAppBar from '../components/PrimaryAppBar';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';

const ChooseStock = props => {
  const navigation = useNavigation();
  const {raw_material_id, product_name} = props.route.params;

  const [inventoryDetailList, setInventoryDetailList] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    const response = await fetch(
      `${API_URL}/Production/GetStockDetailOfRawMaterial?id=${raw_material_id}`,
    );
    const data = await response.json();
    setInventoryDetailList(data);
  };

  const handleCheckboxPress = (index, newValue) => {
    setSelectedStocks(prevSelectedStocks => {
      // If newValue is true, add the stock_number to the selectedStocks array
      if (newValue) {
        const stockNumber = inventoryDetailList[index].stock_number;
        const updatedList = [...prevSelectedStocks, stockNumber];
        return updatedList;
      } else {
        // If newValue is false, remove the stock_number from the selectedStocks array
        const stockNumberToRemove = inventoryDetailList[index].stock_number;
        const updatedList = prevSelectedStocks.filter(
          stock => stock !== stockNumberToRemove,
        );
        return updatedList;
      }
    });
  };

  const handleDone = () => {
    if (selectedStocks.length > 0) {
      const stocksObject = {
        stocks: selectedStocks,
        raw_material_id: raw_material_id,
      };
      navigation.popTo('Add Batch', {
        selectedStocks: stocksObject,
      });
    } else
      ToastAndroid.show('Please Select atleast One Stock.', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={product_name} />
      <View style={[styles.tableStyle, {marginTop: 20}]}>
        <Text style={[styles.headerStyle, {flex: 1.8}]}>Stock Number</Text>
        <Text style={[styles.headerStyle, {flex: 0.7}]}>Qty</Text>
        <Text style={[styles.headerStyle, {flex: 1}]}>Price/kg</Text>
        <Text style={[styles.headerStyle, {flex: 1}]}>Date</Text>
      </View>
      <FlatList
        data={inventoryDetailList}
        renderItem={({item, index}) => {
          return (
            <View style={[styles.tableStyle]}>
              <Text style={[styles.columnStyle, {flex: 2.4}]}>
                {item.stock_number}
              </Text>
              <Text style={[styles.columnStyle, {flex: 1}]}>
                {item.quantity} KG
              </Text>
              <Text style={[styles.columnStyle, {flex: 1}]}>
                {parseInt(parseFloat(item.price_per_kg))}
              </Text>
              <Text style={[styles.columnStyle, {flex: 1}]}>
                {item.purchased_date}
              </Text>
              <CheckBox
                value={selectedStocks.includes(item.stock_number)}
                color={'#2196F3'}
                onValueChange={newValue => handleCheckboxPress(index, newValue)}
              />
            </View>
          );
        }}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Done" onPress={handleDone} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tableStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  columnStyle: {
    fontSize: 13,
    color: 'black',
    marginRight: 5,
  },
  headerStyle: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 5,
  },
  buttonWrapper: {
    alignSelf: 'center',
    width: '70%',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
});

export default ChooseStock;
