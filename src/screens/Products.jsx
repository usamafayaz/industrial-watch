import React, {useState, useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList, Text} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import {API_URL} from '../../apiConfig';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchLinkedProducts();
    }, []),
  );

  const fetchLinkedProducts = async () => {
    const response = await fetch(`${API_URL}/Production/GetLinkedProducts`);
    const data = await response.json();
    setProductsList(data);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{width: '100%', marginTop: 20}}
        data={productsList}
        renderItem={({item}) => {
          return (
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Product Batches', {
                    item: item,
                  });
                }}>
                <View style={styles.BatchesContainer}>
                  <Text style={styles.productsStyle}>{item.name}</Text>

                  <Icon name="arrow-forward-ios" size={20} color="#555" />
                </View>
              </TouchableOpacity>
              <View style={styles.horizontalLineStyle}></View>
            </View>
          );
        }}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent
          title="Link Product"
          onPress={() => navigation.navigate('Link Product')}
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
    width: '88%',
    height: 1,
    backgroundColor: 'black',
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
});

export default Products;
