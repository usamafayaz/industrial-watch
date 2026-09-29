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
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import TextField from '../components/TextField';
import {API_URL} from '../../apiConfig';

interface Rule {
  id: number;
  name: string;
  // Add more properties if necessary
}

const ProductivityRules = () => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const [rulesList, setRulesList] = useState<Rule[]>([]);
  const fetchProductivityRules = async () => {
    try {
      const response = await fetch(`${API_URL}/Rule/GetAllRule`);
      const data = await response.json();
      setRulesList(data);
    } catch (error) {
      ToastAndroid.show(
        'Error fetching Productivity Rules',
        ToastAndroid.SHORT,
      );
      console.error('Error fetching Productivity Rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProductivityRule = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Rule/AddRule?name=${inputText}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      ToastAndroid.show('Rule Added Successfully', ToastAndroid.SHORT);
      setRulesList(data);
      setInputText('');
      setModalVisibility(false);
      fetchProductivityRules();
    } catch (error) {
      ToastAndroid.show(
        'Error fetching Productivity Rules',
        ToastAndroid.SHORT,
      );
      console.error('Error fetching Productivity Rules:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchProductivityRules();
  }, []);
  const handleInputChange = (text: any) => {
    setInputText(text);
  };

  const handleDeleteRule = async (indexToDelete: number) => {
    try {
      const response = await fetch(
        `${API_URL}/Rule/DeleteRule/?id=${indexToDelete}`,
        {
          method: 'Delete',
        },
      );
      if (response.ok) {
        ToastAndroid.show('Rule deleted successfully.', ToastAndroid.SHORT);
        fetchProductivityRules();
      } else {
        ToastAndroid.show(
          `Failed to delete Productivity Rule `,
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
          data={rulesList}
          renderItem={({item, index}) => {
            return (
              <View></View>
              // <SectionandMaterialCard
              //   id={item.id}
              //   title={item.name}
              //   onDelete={() => handleDeleteRule(item.id)}
              // />
            );
          }}
        />
      </View>
      <Modal isVisible={modalVisibility}>
        <View style={styles.modalWrapper}>
          <Text style={styles.modalHeaderStyle}>Add Rule</Text>
          <TextField
            placeHolder="Rule Name.."
            value={inputText}
            onChangeText={handleInputChange}
          />
          <View style={styles.modalButtonWrapper}>
            <TouchableOpacity onPress={() => setModalVisibility(false)}>
              <Text style={styles.cancelStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addProductivityRule}>
              <Text style={styles.OKStyle}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonWrapper}>
        <ButtonComponent
          title="Add Rule"
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
    height: 200,
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
});

export default ProductivityRules;
