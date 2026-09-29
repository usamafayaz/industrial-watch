import React, {useCallback, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import {useFocusEffect} from '@react-navigation/native';
import SupervisorCard from '../components/SupervisorCard';
import {API_URL} from '../../apiConfig';
const Supervisors = () => {
  const [supervisorList, setSupervisorList] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchSupervisors();
    }, []),
  );

  const fetchSupervisors = async () => {
    try {
      const response = await fetch(`${API_URL}/Employee/GetAllSupervisors`);
      const data = await response.json();
      if (data.length > 0) {
        const formattedData = data.map(item => ({
          id: item.employee_id,
          name: item.employee_name,
          sections: item.sections.join(', '),
        }));
        setSupervisorList(formattedData);
      }
    } catch (error) {
      ToastAndroid.show('Error fetching Supervisors', ToastAndroid.SHORT);
      console.error('Error fetching Supervisors:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={supervisorList}
          renderItem={({item}) => {
            return (
              <SupervisorCard
                id={item.id}
                name={item.name}
                sections={item.sections}
              />
            );
          }}
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
  flatListContainer: {flex: 1, width: '100%'},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Supervisors;
