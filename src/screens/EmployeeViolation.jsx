import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ViolationCard from '../components/ViolationCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {API_URL} from '../../apiConfig';

const EmployeeViolation = props => {
  const [employeeViolations, setEmployeeViolations] = useState([]);
  const name = props.route.params.employee.name;

  useFocusEffect(
    useCallback(() => {
      fetchEmployeeViolations();
    }, []),
  );
  const navigation = useNavigation();
  const fetchEmployeeViolations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Employee/GetAllViolations?employee_id=${props.route.params.employee.employee_id}`,
      );
      const data = await response.json();
      console.log(data);
      setEmployeeViolations(data);
    } catch (error) {
      ToastAndroid.show(
        'Error fetching employee Violations:',
        ToastAndroid.SHORT,
      );
    }
  };

  const formatDate = date => {
    const [day, month, year] = date.split('-').map(Number);
    const formattedDate = new Date(year, month - 1, day);
    return formattedDate.toDateString();
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={name} />

      <Text style={styles.headingStyle}>Violations</Text>
      {employeeViolations.length > 0 ? (
        <FlatList
          data={employeeViolations}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Violation Details', {item, name});
                }}>
                <ViolationCard
                  name={item.rule_name}
                  date={formatDate(item.date)}
                  time={item.time}
                  images={item.images}
                />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Text style={styles.noDataText}>No Violations</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headingStyle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
    marginRight: '60%',
    marginTop: '6%',
  },
  noDataText: {
    color: 'black',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: '70%',
  },
});

export default EmployeeViolation;
