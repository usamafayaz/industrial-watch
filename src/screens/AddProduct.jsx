import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import TextField from '../components/TextField';
import Modal from 'react-native-modal';
import SecondaryAppBar from '../components/SecondaryAppBar';
import {API_URL} from '../../apiConfig';
import SelectListComponent from '../components/SelectListComponent';
import MultiSelectComponent from '../components/MultiSelectComponent';

const AddProduct = () => {
  const [modalView, setModalView] = useState(false);
  const [materialsListFromDB, setMaterialsListFromDB] = useState([]);

  const [productName, setProductName] = useState('');
  const [selectedAngles, setSelectedAngles] = useState([]);

  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantityPerItem, setQuantityPerItem] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');

  const [selectedMaterialsList, setSelectedMaterialsList] = useState([]);

  const unitList = [
    {key: 'kg', value: 'KG'},
    {key: 'mg', value: 'MG'},
    {key: 'g', value: 'Gram'},
  ];

  useEffect(() => {
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
    } finally {
    }
  };
  const anglesList = [
    {key: 'front', value: 'Front'},
    {key: 'back', value: 'Back'},
    {key: 'right', value: 'Right'},
    {key: 'left', value: 'Left'},
    {key: 'front_flip', value: 'Front Flip'},
    {key: 'back_flip', value: 'Back Flip'},
  ];
  const addRawMaterial = () => {
    if (
      selectedMaterial === '' ||
      quantityPerItem === '' ||
      selectedUnit === ''
    ) {
      ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
      return;
    }

    const newMaterial = {
      name: selectedMaterial,
      quantityPerItem: quantityPerItem + ' ' + selectedUnit,
    };

    setSelectedMaterialsList([...selectedMaterialsList, newMaterial]);

    setSelectedMaterial('');
    setQuantityPerItem('');
    setSelectedUnit('');
    setModalView(false);
  };

  const addProduct = async () => {
    try {
      if (
        !productName ||
        selectedAngles.length === 0 ||
        selectedMaterialsList.length === 0
      ) {
        ToastAndroid.show('Please fill all fields', ToastAndroid.SHORT);
        return;
      }
      const inspectionAngles = selectedAngles.map(item => item).join(', ');

      const data = {
        name: productName,
        inspection_angles: inspectionAngles,
        materials: selectedMaterialsList.map(material => ({
          raw_material_id: parseInt(material.name),
          quantity: parseFloat(material.quantityPerItem),
          unit: material.quantityPerItem.split(' ')[1], // Extracting unit from quantityPerItem
        })),
      };

      const response = await fetch(`${API_URL}/Production/AddProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);

        setProductName('');
        setSelectedAngles([]);
        setSelectedMaterialsList([]);
        navigation.goBack();
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.message || 'Failed to add product',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Error adding product:', error);
      ToastAndroid.show('An unexpected error occurred', ToastAndroid.SHORT);
    }
  };
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <SecondaryAppBar text="" />
        <TouchableOpacity
          style={{position: 'absolute', top: '2.5%', left: '58%'}}
          onPress={() => {
            setModalView(true);
          }}>
          <Text style={styles.buttonTextStyle}>Add Material</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>Product Name:</Text>
        <TextField
          placeHolder="Enter Product Name"
          value={productName}
          onChangeText={text => setProductName(text)}
        />
        <Text style={styles.hintText}>Inspection Angles:</Text>
        <MultiSelectComponent
          data={anglesList}
          setSelected={setSelectedAngles}
          placeholder={'Select Angles'}
          save={'value'}
        />

        <Text style={styles.headingStyle}>Formula per Item</Text>
        <View style={{flex: 1}}>
          <View style={[styles.tableStyle, {marginVertical: 10}]}>
            <Text
              style={[
                styles.columnStyle,
                {marginLeft: 10, fontWeight: 'bold'},
              ]}>
              #
            </Text>
            <Text style={[styles.columnStyle, {fontWeight: 'bold'}]}>Name</Text>
            <Text style={[styles.columnStyle, {fontWeight: 'bold'}]}>
              Quantity
            </Text>
          </View>
          <View style={styles.horizontalLineStyle}></View>
          <FlatList
            style={{flex: 1}}
            data={selectedMaterialsList}
            renderItem={({item, index}) => {
              // Find the material object with the matching ID
              const selectedMaterial = materialsListFromDB.find(
                material => material.key === item.name,
              );
              // If the material is found, use its name; otherwise, fallback to the original ID
              const materialName = selectedMaterial
                ? selectedMaterial.value
                : item.name;
              return (
                <View>
                  <View style={styles.tableStyle}>
                    <Text
                      style={[
                        styles.columnStyle,
                        {fontWeight: 'bold', margin: 12},
                      ]}>
                      {index + 1}
                    </Text>
                    <Text style={[styles.columnStyle, {margin: 12}]}>
                      {materialName}
                    </Text>
                    <Text style={[styles.columnStyle, {margin: 12}]}>
                      {item.quantityPerItem}
                    </Text>
                  </View>
                  <View style={styles.horizontalLineStyle}></View>
                </View>
              );
            }}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <Modal isVisible={modalView}>
          <View style={styles.modalWrapper}>
            <Text style={styles.nameStyle}>New Material</Text>
            <Text style={styles.hintText}>Name:</Text>

            <SelectListComponent
              data={materialsListFromDB}
              setSelected={setSelectedMaterial}
              placeholder="Select Material"
            />
            <Text style={styles.hintText}>Quantity per Item:</Text>
            <TextField
              placeHolder="Quantity per Item"
              value={quantityPerItem}
              isNumeric={true}
              onChangeText={text => setQuantityPerItem(text)}
            />
            <Text style={styles.hintText}>Unit:</Text>
            <SelectListComponent
              data={unitList}
              setSelected={setSelectedUnit}
              placeholder="Select Unit"
            />

            <View style={styles.modalButtonWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setModalView(false);
                }}>
                <Text style={styles.cancelStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addRawMaterial}>
                <Text style={styles.addStyle}>Add Raw Material</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.buttonWrapper}>
          <ButtonComponent title="Add Product" onPress={addProduct} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonTextStyle: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 19,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: 'right',
    borderRadius: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  headingStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    alignSelf: 'center',
  },
  hintText: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
  },
  columnStyle: {
    flex: 1, // This ensures equal distribution of space among columns
    fontSize: 16,
    color: 'black',
  },
  tableStyle: {
    flexDirection: 'row',
    paddingHorizontal: 25,
  },
  nameStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    margin: '6%',
    alignSelf: 'flex-start',
    marginLeft: '10%',
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
    marginTop: '10%',
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

  horizontalLineStyle: {
    width: '80%',
    height: 0.5,
    backgroundColor: 'grey',
    alignSelf: 'center',
  },
});

export default AddProduct;
