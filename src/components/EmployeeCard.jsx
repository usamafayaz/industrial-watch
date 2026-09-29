import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import {API_URL} from '../../apiConfig';

const EmployeeCard = ({employees}) => {
  const getContainerWidth = () => {
    if (employees.length === 1) {
      return '65%';
    }
    return '46%';
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <FlatList
        data={employees}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={[styles.employeeContainer, {width: getContainerWidth()}]}
              onPress={() => {
                navigation.navigate('Employee Detail', {employee: item});
              }}>
              <View style={styles.imageContainer}>
                <Image
                  resizeMode="cover"
                  source={{
                    uri: `${API_URL}/EmployeeImage/${
                      item.employee_id
                    }/${encodeURIComponent(item.image)}`,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.nameStyle}>{item.name}</Text>

                <View style={styles.productivityContainer}>
                  <Icon name="clock" color={'#FFB800'} size={15}></Icon>
                  <Text style={styles.productivityStyle}>
                    {item.productivity.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.positionStyle}>{item.job_role}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.employee_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: '3%',
    marginTop: 15,
  },
  grid: {
    justifyContent: 'space-between',
  },
  employeeContainer: {
    width: '46%',
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
    borderWidth: 2,
    borderColor: '#CAC4D0',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 2,
  },
  imageContainer: {
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 6,
  },
  image: {width: 155, height: 105, borderRadius: 10},
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameStyle: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  positionStyle: {
    color: '#616161',
    fontSize: 14,
  },
  productivityStyle: {
    color: 'black',
    fontSize: 15,
    marginLeft: 5,
  },
  productivityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EmployeeCard;
