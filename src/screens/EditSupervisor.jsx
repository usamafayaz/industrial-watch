import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import {API_URL} from '../../apiConfig';
import TextField from '../components/TextField';
import ButtonComponent from '../components/ButtonComponent';
import {useNavigation} from '@react-navigation/native';
import MultiSelectComponent from '../components/MultiSelectComponent';

const EditSupervisor = props => {
  const id = props.route.params.id;
  const [sectionList, setSectionList] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSections, setSelectedSection] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    fetchSection();
    fetchSupervisorDetail();
  }, []);

  const fetchSection = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Section/GetAllSections?status=${1}`,
      );
      const data = await response.json();
      const formattedData = data.map(item => ({
        key: item.id.toString(),
        value: item.name,
      }));
      setSectionList(formattedData);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch sections. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const fetchSupervisorDetail = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Employee/GetSupervisorDetail?supervisor_id=${id}`,
      );
      const data = await response.json();
      const formattedData = data.map(item => ({
        sup_username: item.username,
        sup_password: item.password,
        sup_sections: item.sections,
      }));
      console.log(formattedData[0].sup_sections);
      // setSelectedSection([
      //   {
      //     key: formattedData[0].sup_sections.id,
      //     value: formattedData[0].sup_sections.name,
      //   },
      // ]);
      setUsername(formattedData[0].sup_username);
      setPassword(formattedData[0].sup_password);
    } catch (error) {
      ToastAndroid.show(
        'Failed to supervisor detail. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };

  const updateSupervisor = async () => {
    if (!username || !password || selectedSections.length == 0) {
      ToastAndroid.show('Please fill all the fields.', ToastAndroid.SHORT);
      return;
    }
    try {
      const data = {
        employee_id: id,
        username: username,
        password: password,
        sections: selectedSections.map(item => parseInt(item)),
      };
      if (!data.sections) {
        ToastAndroid.show('Please fill all the fields.', ToastAndroid.SHORT);
        return;
      }
      const response = await fetch(`${API_URL}/Employee/UpdateSupervisor`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
        navigation.goBack();
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.message || 'Failed to update supervisor',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Error updating supervisor:', error);
      ToastAndroid.show('An unexpected error occurred', ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.hintText, {marginTop: '10%'}]}>Username</Text>
      <TextField
        placeHolder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.hintText}>Password</Text>
      <TextField
        placeHolder="Enter Password"
        value={password}
        eyeIcon={true}
        onChangeText={setPassword}
      />
      <Text style={styles.hintText}>Sections</Text>
      <MultiSelectComponent
        data={sectionList}
        setSelected={setSelectedSection}
        placeholder="Select Sections"
        save={'key'}
      />
      <View style={styles.buttonWrapper}>
        <ButtonComponent title="Edit Supervisor" onPress={updateSupervisor} />
      </View>
    </ScrollView>
  );
};

export default EditSupervisor;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  hintText: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 35,
    marginTop: 10,
  },
  rowStyle: {
    width: '90%',
    flexDirection: 'column',
  },
  buttonWrapper: {
    width: '70%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
