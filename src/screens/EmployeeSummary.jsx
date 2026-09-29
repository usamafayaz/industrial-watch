import React, {useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import ToastAndroid from '../utils/Toast';
import {Text} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import PrimaryAppBar from '../components/PrimaryAppBar';
import MonthPicker from '../components/MonthYearPicker';
import Icon from '@expo/vector-icons/MaterialIcons';
import {API_URL} from '../../apiConfig';

const EmployeeSummary = props => {
  const {employee_id} = props.route.params.employee;
  const [date, setDate] = useState(new Date());
  const [pickerVisibility, setPickerVisibility] = useState(false);
  const [employeeSummary, setEmployeeSummary] = useState(null);

  useEffect(() => {
    fetchEmployeeSummary(date);
  }, []);

  const fetchEmployeeSummary = async selectedDate => {
    try {
      const formattedDate = `${
        selectedDate.getMonth() + 1
      },${selectedDate.getFullYear()}`;
      const response = await fetch(
        `${API_URL}/Employee/GetEmployeeSummary?employee_id=${employee_id}&date=${formattedDate}`,
      );
      const data = await response.json();

      if (!response.ok) {
        ToastAndroid.show(`${data.message}`, ToastAndroid.SHORT);
      } else {
        setEmployeeSummary(data);
        console.log(data);
      }
    } catch (error) {
      console.error('Error fetching employee summary:', error);
    }
  };

  const onValueChange = (event, newDate) => {
    if (event === 'dismissedAction' || !newDate) {
      setPickerVisibility(false);
      return;
    }
    const selectedDate = new Date(date);
    selectedDate.setMonth(newDate.getMonth());
    selectedDate.setFullYear(newDate.getFullYear());
    setPickerVisibility(false);
    setDate(selectedDate);
    fetchEmployeeSummary(newDate);
  };

  const getDisplayedMonthYear = date => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <View style={styles.container}>
      <PrimaryAppBar text={'Summary'} />
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.label}>Select Month:</Text>
        <TouchableOpacity
          style={styles.dateRow}
          onPress={() => {
            setPickerVisibility(true);
          }}>
          <Icon name="calendar-month" color={'#000000'} size={30} />
          <Text style={styles.dateStyle}>{getDisplayedMonthYear(date)}</Text>
          <Icon name="arrow-right" color={'#000000'} size={30} />
        </TouchableOpacity>
        {pickerVisibility && (
          <MonthPicker
            onChange={onValueChange}
            value={date}
            minimumDate={new Date(2000, 1)}
            maximumDate={new Date()}
            locale="en"
          />
        )}
        <View style={styles.horizontalLineStyle}></View>
        {employeeSummary && (
          <>
            <View style={styles.progessContainer}>
              <Progress.Circle
                progress={
                  employeeSummary.attendance_rate == 'N/A'
                    ? 0
                    : parseFloat(
                        employeeSummary.attendance_rate.split('/')[0],
                      ) /
                      parseFloat(employeeSummary.attendance_rate.split('/')[1])
                }
                size={160}
                showsText={true}
                color="#02DE12"
                thickness={15}
                unfilledColor="#D4D4D4"
                borderColor="#D4D4D4"
                textStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: 'black',
                  textAlign: 'center',
                }}
                formatText={() =>
                  employeeSummary.attendance_rate == 'N/A'
                    ? 'No Record'
                    : `${employeeSummary.attendance_rate}\nAttendance`
                }
              />
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.headingStyle}>Fine</Text>
              <Text style={styles.amountStyle}>
                {employeeSummary.total_fine}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.headingStyle}>Violation</Text>
              <Text style={styles.amountStyle}>
                {employeeSummary.violation_count}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  label: {fontSize: 18, color: '#4C4C4C', marginTop: '12%'},
  horizontalLineStyle: {
    alignSelf: 'center',
    width: '58%',
    backgroundColor: 'grey',
    marginTop: '2%',
    height: 0.8,
    opacity: 0.5,
  },
  progessContainer: {alignItems: 'center', marginVertical: '10%'},
  bottomContainer: {
    marginBottom: '6%',
    width: '100%',
    height: '13%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 19.99,
  },
  headingStyle: {fontSize: 18, fontWeight: '700', color: '#4E4E4E'},
  amountStyle: {fontSize: 20, fontWeight: '900', color: 'black'},
  dateStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  dateRow: {
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmployeeSummary;
