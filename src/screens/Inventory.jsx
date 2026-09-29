import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, FlatList, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {API_URL} from '../../apiConfig';
import ButtonComponent from '../components/ButtonComponent';
import Modal from 'react-native-modal';
import TextField from '../components/TextField';
import {useNavigation} from '@react-navigation/native';

import ToastAndroid from '../utils/Toast';
import SelectListComponent from '../components/SelectListComponent';

const Inventory = () => {
  const navigation = useNavigation();
  const [modalView, setModalView] = useState(false);

  const [materialsListFromDB, setMaterialsListFromDB] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const [stockList, setStockList] = useState([]);
  useEffect(() => {
    fetchStock();
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const response = await fetch(`${API_URL}/Production/GetAllRawMaterials`);
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.id.toString(),
        value: item.name,
      }));
      setMaterialsListFromDB(formattedData);
    } catch (error) {
      ToastAndroid.show('Error fetching Raw Materials', ToastAndroid.SHORT);
      console.error('Error fetching Raw Materials:', error);
    }
  };

  const addStock = async () => {
    if (!selectedMaterial || !quantity || !price) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }
    try {
      const data = {
        raw_material_id: parseInt(selectedMaterial),
        price_per_kg: parseFloat(price),
        quantity: parseInt(quantity),
      };

      const response = await fetch(`${API_URL}/Production/AddStock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        setSelectedMaterial('');
        setQuantity('');
        setPrice('');
        setModalView(false);
        fetchStock();
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.message || 'Failed to add product',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error adding product:', error);
      ToastAndroid.show('An unexpected error occurred', ToastAndroid.SHORT);
    }
  };

  const fetchStock = async () => {
    const response = await fetch(`${API_URL}/Production/GetAllInventory`);
    const data = await response.json();
    setStockList(data);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.tableStyle, {width: '60%'}]}>
        <Text style={styles.headerStyle}>#</Text>
        <Text style={styles.headerStyle}>Material</Text>
        <Text style={styles.headerStyle}>Quantity</Text>
      </View>
      <FlatList
        data={stockList}
        renderItem={({item, index}) => {
          return (
            <View style={[styles.tableStyle, {width: '80%'}]}>
              <Text style={styles.columnStyle}>{index + 1}</Text>
              <Text style={styles.columnStyle}>{item.raw_material_name}</Text>
              <Text style={styles.columnStyle}>{item.total_quantity} KG</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Inventory Detail', {item: item});
                }}>
                <Text style={styles.detailLink}>Detail</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Add Stock" onPress={() => setModalView(true)} />
      </View>
      <Modal isVisible={modalView}>
        <View style={styles.modalWrapper}>
          <Text style={styles.nameStyle}>Add Stock</Text>
          <Text style={styles.hintText}>Name</Text>

          <SelectListComponent
            data={materialsListFromDB}
            setSelected={setSelectedMaterial}
            placeholder={'Select Material'}
          />
          <Text style={styles.hintText}>Quantity/Kg</Text>
          <TextField
            placeHolder="e.g 100"
            value={quantity}
            isNumeric={true}
            onChangeText={text => setQuantity(text)}
          />

          <Text style={styles.hintText}>Price/Kg</Text>
          <TextField
            placeHolder="e.g 1500"
            value={price}
            isNumeric={true}
            onChangeText={text => setPrice(text)}
          />

          <View style={styles.modalButtonWrapper}>
            <TouchableOpacity
              onPress={() => {
                setModalView(false);
              }}>
              <Text style={styles.cancelStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addStock}>
              <Text style={styles.addStyle}>Add Stock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 30,
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

  modalWrapper: {
    backgroundColor: 'white',
    height: '90%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 30,
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    marginTop: '6%',
    marginRight: 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelStyle: {
    color: '#2196F3',
    marginRight: 10,
    fontWeight: 'bold',
    marginLeft: 40,
  },
  addStyle: {
    color: 'white',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 15,
    fontWeight: 'bold',
  },

  nameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    margin: '6%',
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  hintText: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
  },
});
export default Inventory;
