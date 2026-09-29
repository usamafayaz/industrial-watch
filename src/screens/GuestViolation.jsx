import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import ViolationCard from '../components/ViolationCard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {API_URL} from '../../apiConfig';

const GuestViolation = props => {
  const [employeeViolations, setEmployeeViolations] = useState([]);
  const name = props.route.params.employee.name;
  const [loading, setLoading] = useState(false); // State to manage loading indicator

  useFocusEffect(
    useCallback(() => {
      fetchGuestViolations();
    }, []),
  );
  const navigation = useNavigation();
  const fetchGuestViolations = async () => {
    setLoading(true); // Show loading indicator when API call starts
    try {
      const response = await fetch(
        `${API_URL}/Employee/GetAllGuestViolations?employee_id=${props.route.params.employee.employee_id}`,
      );
      const data = await response.json();
      setEmployeeViolations(data);
    } catch (error) {
      ToastAndroid.show(
        'Error fetching employee Violations:',
        ToastAndroid.SHORT,
      );
    }
    setLoading(false); // Hide loading indicator after API call completes
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
                  navigation.navigate('Violation Details', {
                    item,
                    name,
                    isGuest: true,
                  });
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
      ) : null}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
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
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default GuestViolation;
