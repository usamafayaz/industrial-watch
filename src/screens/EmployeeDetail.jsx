import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import * as Progress from 'react-native-progress';
import CardComponent from '../components/CardComponent';
import {useNavigation} from '@react-navigation/native';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {API_URL} from '../../apiConfig';

const EmployeeDetail = props => {
  const navigation = useNavigation();
  useEffect(() => {
    fetchEmployeeDetails();
  }, []);
  const [productivity, setProductivity] = useState(0);
  const [totalFine, setTotalFine] = useState(0);
  const fetchEmployeeDetails = async () => {
    const response = await fetch(
      `${API_URL}/Employee/GetEmployeeDetail?employee_id=${props.route.params.employee.employee_id}`,
    );
    const result = await response.json();
    if (response.ok) {
      setProductivity(result.productivity);
      setTotalFine(result.total_fine);
    } else {
      ToastAndroid.show(result.message, ToastAndroid.SHORT);
    }
  };
  const CardList = [
    {
      name: 'Attendance',
      onPress: () => {
        navigation.navigate('Attendance', {
          employee: props.route.params.employee,
        });
      },
    },
    {
      name: 'Violation',
      onPress: () => {
        navigation.navigate('Employee Violation', {
          employee: props.route.params.employee,
        });
      },
    },
    {
      name: 'Summary',
      onPress: () => {
        navigation.navigate('Employee Summary', {
          employee: props.route.params.employee,
        });
      },
    },
  ];
  return (
    <View style={styles.container}>
      <PrimaryAppBar text={props.route.params.employee.name} />
      <Progress.Circle
        progress={productivity / 100}
        size={170}
        showsText={true}
        color="#02DE12"
        thickness={15}
        unfilledColor="#D4D4D4"
        borderColor="#D4D4D4"
        textStyle={{
          fontSize: 19,
          fontWeight: 'bold',
          color: 'black',
          textAlign: 'center',
        }}
        style={{marginTop: '10%'}}
        formatText={() => `${productivity.toFixed(1)}%\nProductivity`}
      />
      <View style={styles.fineContainer}>
        <Text style={styles.fineHeading}>Total Fine</Text>
        <Text style={styles.fineAmount}>{totalFine}</Text>
      </View>
      <FlatList
        style={{width: '100%'}}
        data={CardList}
        renderItem={({item}) => {
          return (
            <CardComponent
              onPress={item.onPress}
              title={item.name}></CardComponent>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  fineContainer: {
    paddingHorizontal: '34%',
    paddingVertical: '4%',
    alignItems: 'center',
    marginVertical: '10%',
    shadowColor: 'black',
    elevation: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 19.99,
  },

  fineHeading: {color: '#4E4E4E', fontWeight: 'bold', fontSize: 20},
  fineAmount: {color: 'black', fontWeight: '900', fontSize: 28},
});

export default EmployeeDetail;
