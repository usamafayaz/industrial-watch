import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';
import {useNavigation} from '@react-navigation/native';
import ButtonComponent from '../components/ButtonComponent';
const Guests = () => {
  const [employees, setEmployees] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    fetchAllEmployees(`${API_URL}/Employee/GetAllGuests`);
  }, []);

  const fetchAllEmployees = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setEmployees(data);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => {
              navigation.navigate('Guest Violation', {employee: item});
              //   console.log(item);
            }}>
            <Image
              resizeMode="cover"
              source={{
                uri: `${API_URL}/EmployeeImage/${
                  item.employee_id
                }/${encodeURIComponent(item.image)}`,
              }}
              style={styles.image}
              borderRadius={30}
            />
            <Text style={styles.nameStyle}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent
          title="Add Guest"
          onPress={() => {
            navigation.navigate('Add Guest');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectListStyle: {
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    borderRadius: 20,
    marginTop: '2%',
  },
  selectListInput: {color: 'black', fontSize: 18},
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    paddingHorizontal: '10%',
    justifyContent: 'space-evenly',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: '10%',
  },
  productivityStyle: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  nameStyle: {
    fontSize: 19,
    color: 'black',
    fontWeight: 'bold',
    marginRight: '30%',
  },
  badgeStyle: {
    fontSize: 25,
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 10,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
  },
});

export default Guests;
