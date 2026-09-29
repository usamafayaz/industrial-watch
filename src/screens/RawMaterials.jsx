import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SectionandMaterialCard from '../components/SectionandMaterialCard';
import ButtonComponent from '../components/ButtonComponent';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import TextField from '../components/TextField';
import {API_URL} from '../../apiConfig';

const RawMaterials = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [rawMaterialsList, setRawMaterialsList] = useState([]);

  useEffect(() => {
    fetchRawMaterials();
  }, []);
  const fetchRawMaterials = async () => {
    try {
      const response = await fetch(`${API_URL}/Production/GetAllRawMaterials`);
      const data = await response.json();
      setRawMaterialsList(data);
    } catch (error) {
      ToastAndroid.show('Error fetching Raw Materials', ToastAndroid.SHORT);
      console.error('Error fetching Raw Materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRawMaterials = async () => {
    if (!inputText) {
      ToastAndroid.show('Please enter Raw Material Name', ToastAndroid.SHORT);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/Production/AddRawMaterial?name=${inputText}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      ToastAndroid.show('Raw Material Added Successfully', ToastAndroid.SHORT);
      setRawMaterialsList(data);
      setInputText('');
      setModalVisibility(false);
      fetchRawMaterials();
    } catch (error) {
      ToastAndroid.show(
        'Error fetching Productivity Rules',
        ToastAndroid.SHORT,
      );
      console.error('Error fetching Productivity Rules:', error);
    } finally {
    }
  };

  const handleInputChange = text => {
    setInputText(text);
  };

  const handleDeleteRule = async indexToDelete => {
    try {
      const response = await fetch(
        `${API_URL}/Rule/DeleteRule/?id=${indexToDelete}`,
        {
          method: 'Delete',
        },
      );
      if (response.ok) {
        ToastAndroid.show('Rule deleted successfully.', ToastAndroid.SHORT);
        fetchRawMaterials();
      } else {
        ToastAndroid.show(
          `Failed to delete Raw Materials `,
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
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
          data={rawMaterialsList}
          renderItem={({item, index}) => {
            return (
              <SectionandMaterialCard
                id={item.id}
                title={item.name}
                archiveRequired={false}
              />
            );
          }}
        />
      </View>
      <Modal isVisible={modalVisibility}>
        <View style={styles.modalWrapper}>
          <Text style={styles.modalHeaderStyle}>Add Raw Material</Text>
          <Text style={styles.hintText}>Name:</Text>

          <TextField
            placeHolder="e.g. Metal"
            value={inputText}
            onChangeText={handleInputChange}
          />
          <View style={styles.modalButtonWrapper}>
            <TouchableOpacity onPress={() => setModalVisibility(false)}>
              <Text style={styles.cancelStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addRawMaterials}>
              <Text style={styles.OKStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonWrapper}>
        <ButtonComponent
          title="Add Raw Material"
          onPress={() => setModalVisibility(true)}
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
  flatListContainer: {
    flex: 1,
    marginLeft: '9%',
    width: '100%',
  },
  flatList: {
    width: '100%',
  },
  buttonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '70%',
  },
  modalHeaderStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 12,
    alignSelf: 'flex-start',
    marginTop: '5%',
    marginLeft: '9%',
  },
  modalWrapper: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 250,
    width: 300,
    alignSelf: 'center',
    borderRadius: 30,
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    marginLeft: '43%',
    marginTop: '7%',
  },
  cancelStyle: {
    color: '#2196F3',
    marginRight: 10,
    paddingVertical: '5%',
  },
  OKStyle: {
    color: 'white',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintText: {
    alignSelf: 'flex-start',
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
    marginTop: 20,
  },
});

export default RawMaterials;
