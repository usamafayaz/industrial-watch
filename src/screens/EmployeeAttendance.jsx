import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {API_URL} from '../../apiConfig';
import {useFocusEffect} from '@react-navigation/native';

const EmployeeAttendance = props => {
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEmployeeAttendance();
    }, []),
  );

  const fetchEmployeeAttendance = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Employee/GetEmployeeAttendance?employee_id=${props.route.params.employee.employee_id}`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      if (data.message) {
        ToastAndroid.show('No Data Found', ToastAndroid.SHORT);
      }
      setEmployeeAttendance(data.reverse());
    } catch (error) {
      console.log('Error fetching employee attendance:' + error);
      setError(true);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.noDataView}>
          <Text style={styles.noDataText}>No data found.</Text>
        </View>
      );
    } else {
      return (
        <>
          <View style={[styles.headerContainer, {marginTop: '5%'}]}>
            <Text style={[styles.tableHeading, {marginLeft: '10%'}]}>Date</Text>
            <Text style={[styles.tableHeading, {marginRight: '5%'}]}>
              Status
            </Text>
          </View>
          <View
            style={[
              styles.verticalLineStyle,
              {height: calculateVerticalLineHeight()},
            ]}></View>
          <FlatList
            data={employeeAttendance}
            renderItem={({item}) => (
              <>
                <View style={styles.horizontalLineStyle}></View>
                <View
                  style={[
                    styles.headerContainer,
                    {justifyContent: 'space-evenly'},
                  ]}>
                  <Text style={[styles.dateTextStyle, {marginRight: '35%'}]}>
                    {item.attendance_date}
                  </Text>
                  <Text style={styles.statusTextStyle}>{item.status}</Text>
                </View>
              </>
            )}
          />
        </>
      );
    }
  };

  const calculateVerticalLineHeight = () => {
    if (employeeAttendance.length === 0) {
      return 0;
    }
    return employeeAttendance.length * 43.4 + 40;
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={props.route.params.employee.name} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    width: '100%',
    paddingVertical: '1%',
  },
  tableHeading: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
  },
  dateTextStyle: {color: 'grey', fontSize: 20},
  statusTextStyle: {color: 'grey', fontSize: 20, fontWeight: 'bold'},
  horizontalLineStyle: {
    width: '100%',
    backgroundColor: '#676767',
    marginTop: '2%',
    height: 1.5,
    opacity: 0.5,
  },
  verticalLineStyle: {
    width: 1.5,
    backgroundColor: '#676767',
    position: 'absolute',
    top: '12%',
    left: '60%',
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
  },
  noDataText: {
    color: 'black',
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});

export default EmployeeAttendance;
