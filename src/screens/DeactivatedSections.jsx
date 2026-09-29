import React, {useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SectionandMaterialCard from '../components/SectionandMaterialCard';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import {API_URL} from '../../apiConfig';

const DeactivatedSections = () => {
  const navigation = useNavigation();
  const [sectionsList, setSectionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSections = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Section/GetAllSections?status=${0}`,
      );
      const data = await response.json();
      setSectionList(data);
    } catch (error) {
      ToastAndroid.show('Error fetching sections', ToastAndroid.SHORT);
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    // useCallback prevent unnecessary re-renders caused by creating a new
    // function instance on every render.
    useCallback(() => {
      fetchSections();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSections();
  };

  const changeSectionAcitivityStatus = async id => {
    try {
      const response = await fetch(
        `${API_URL}/Section/ChangeSectionAcitivityStatus?section_id=${id}`,
      );
      if (response.ok) {
        ToastAndroid.show('Section Successfully Activated', ToastAndroid.SHORT);
        fetchSections();
      }
    } catch (error) {
      ToastAndroid.show('Error while activating section', ToastAndroid.SHORT);
      console.error('Error while activating section:', error);
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
          style={styles.flatList}
          data={sectionsList}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Section Detail', {
                  SectionName: item.name,
                  id: item.id,
                })
              }>
              <SectionandMaterialCard
                id={item.id}
                title={item.name}
                archiveRequired={true}
                onArchivePress={() => changeSectionAcitivityStatus(item.id)}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
            />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  flatListContainer: {
    flex: 1,
    marginLeft: '9%',
    width: '100%',
  },
  flatList: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeactivatedSections;
