import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';
import TextField from '../components/TextField';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';

const LinkProduct = () => {
  const [productListFromDB, setProductListFromDB] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [packsPerBatch, setPacksPerBatch] = useState('');
  const [piecePerPack, setPiecePerPack] = useState('');
  const [rejectionTolerance, setRejectionTolerance] = useState('');

  const navigation = useNavigation();
  useEffect(() => {
    fetchProductList();
  }, []);
  const fetchProductList = async () => {
    try {
      const response = await fetch(`${API_URL}/Production/GetUnlinkedProducts`);
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.product_number.toString(),
        value: item.name,
      }));
      setProductListFromDB(formattedData);
    } catch (error) {
      ToastAndroid.show('Error fetching Raw Materials', ToastAndroid.SHORT);
      console.error('Error fetching Raw Materials:', error);
    }
  };
  const linkProduct = async () => {
    try {
      if (
        !selectedProduct ||
        !packsPerBatch ||
        !piecePerPack ||
        !rejectionTolerance
      ) {
        ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
        return;
      }

      const data = {
        product_number: selectedProduct,
        packs_per_batch: parseInt(packsPerBatch),
        piece_per_pack: parseInt(piecePerPack),
        rejection_tolerance: parseFloat(rejectionTolerance),
      };

      const response = await fetch(`${API_URL}/Production/LinkProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        ToastAndroid.show('Product Linked Successfulyy', ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        ToastAndroid.show('Failed to link the Product', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Error Linking the Product', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hintText}>Product Name</Text>
      <SelectListComponent
        data={productListFromDB}
        setSelected={setSelectedProduct}
        placeholder="Select Product"
      />
      <View style={styles.rowStyle}>
        <Text style={styles.hintText}>Packs/batch</Text>
        <Text style={[styles.hintText, {marginLeft: '35%'}]}>Piece/pack</Text>
      </View>
      <View style={[styles.rowStyle, {marginLeft: '6%'}]}>
        <View style={{width: '40%'}}>
          <TextField
            placeHolder="e.g  60"
            value={packsPerBatch}
            isNumeric={true}
            onChangeText={setPacksPerBatch}
          />
        </View>
        <View style={{width: '40%', marginLeft: '20%'}}>
          <TextField
            placeHolder="e.g  12"
            value={piecePerPack}
            isNumeric={true}
            onChangeText={setPiecePerPack}
          />
        </View>
      </View>
      <Text style={styles.hintText}>Rejection Tolerance %</Text>
      <TextField
        placeHolder="e.g  0.5"
        value={rejectionTolerance}
        isNumeric={true}
        onChangeText={setRejectionTolerance}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Link" onPress={linkProduct} />
      </View>
    </View>
  );
};

export default LinkProduct;

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
  rowStyle: {
    width: '90%',
    flexDirection: 'row',
  },
  buttonWrapper: {
    marginTop: '80%',
    alignItems: 'center',
    width: '70%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
