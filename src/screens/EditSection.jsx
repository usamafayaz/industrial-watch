import React, {useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Button,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import CheckBox from 'expo-checkbox';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {API_URL} from '../../apiConfig';
import TextField from '../components/TextField';
import ButtonComponent from '../components/ButtonComponent';

const EditSection = props => {
  const [inputText, setInputText] = useState(props.route.params.SectionName);
  const [rulesList, setRulesList] = useState([]);
  const [assignedRules, setAssignedRules] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for  RefreshControl

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const rulesResponse = await fetch(`${API_URL}/Section/GetAllRule`);
          const rulesData = await rulesResponse.json();

          const detailResponse = await fetch(
            `${API_URL}/Section/GetSectionDetail?section_id=${props.route.params.id}`,
          );
          const detailData = await detailResponse.json();

          const updatedRulesList = rulesData.map(item => {
            const assignedRule = detailData.rules.find(
              rule => rule.rule_id === item.id,
            );
            return {
              id: item.id,
              title: item.name,
              fine: assignedRule ? assignedRule.fine : 0,
              allowed_time: assignedRule
                ? parseTime(assignedRule.allowed_time)
                : {hours: 0, minutes: 0, seconds: 0},
              checkBox: !!assignedRule,
            };
          });

          setRulesList(updatedRulesList);
          setAssignedRules(detailData.rules);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();

      return () => {
        // Clean up function (if needed)
      };
    }, []),
  );
  useEffect(() => {
    if (!isLoading) {
      fetchDetail();
    }
  }, [isLoading]);

  const fetchProductivityRules = async () => {
    try {
      const response = await fetch(`${API_URL}/Section/GetAllRule`);
      const data = await response.json();
      const updatedRulesList = data.map(item => {
        const assignedRule = assignedRules.find(
          rule => rule.rule_id === item.id,
        );
        return {
          id: item.id,
          title: item.name,
          fine: assignedRule ? assignedRule.fine : 0,
          allowed_time: assignedRule
            ? parseTime(assignedRule.allowed_time)
            : {hours: 0, minutes: 0, seconds: 0},
          checkBox: !!assignedRule,
        };
      });
      setRulesList(updatedRulesList);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching Productivity Rules:', error);
    }
  };

  const parseTime = timeString => {
    if (!timeString) {
      return {hours: 0, minutes: 0, seconds: 0};
    }
    const [hours, minutes, seconds] = timeString.split(':').map(Number); // seconds = 0
    return {hours: hours || 0, minutes: minutes || 0, seconds: seconds || 0};
  };

  const fetchDetail = async () => {
    try {
      const respose = await fetch(
        `${API_URL}/Section/GetSectionDetail?section_id=${props.route.params.id}`,
      );
      const data = await respose.json();
      setAssignedRules(data.rules);
    } catch (error) {
      console.error('Error fetching section detail:', error);
    }
  };

  const handleConfirmSection = async () => {
    if (inputText != '') {
      try {
        const filteredList = rulesList.filter(item => item.checkBox);
        const data = {
          id: props.route.params.id,
          name: inputText,
          rules: filteredList.map(rule => ({
            rule_id: rule.id,
            fine: rule.fine,
            allowed_time: `${rule.allowed_time.hours}:${rule.allowed_time.minutes}:${rule.allowed_time.seconds}`,
          })),
        };
        console.log(data, 'sdsadsa');
        const response = await fetch(`${API_URL}/Section/UpdateSection`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          ToastAndroid.show('Section Updated Successfully', ToastAndroid.SHORT);
          navigation.popTo('Sections');
        } else {
          ToastAndroid.show(
            'Error occured while updating Section.',
            ToastAndroid.SHORT,
          );
        }
      } catch (error) {
        ToastAndroid.show(
          'Error occured while updating Section.',
          ToastAndroid.SHORT,
        );
      }
    } else {
      ToastAndroid.show("Section name can't be empty", ToastAndroid.SHORT);
    }
  };

  const handleCheckBoxChange = item => {
    const ruleIndex = rulesList.findIndex(rule => rule.id === item.id);
    if (ruleIndex !== -1) {
      const updatedRulesList = [...rulesList];
      if (updatedRulesList[ruleIndex].checkBox) {
        // Uncheck the box and reset the values
        updatedRulesList[ruleIndex].checkBox = false;
        updatedRulesList[ruleIndex].fine = 0;
        updatedRulesList[ruleIndex].allowed_time = {
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      } else {
        if (
          item.fine === 0 ||
          (item.allowed_time.hours === 0 &&
            item.allowed_time.minutes === 0 &&
            item.allowed_time.seconds === 0)
        ) {
          ToastAndroid.show('Enter Fine and Time First', ToastAndroid.LONG);
        } else {
          // Check the box
          updatedRulesList[ruleIndex].checkBox = true;
        }
      }
      setRulesList(updatedRulesList);
    }
  };

  const renderRuleItem = ({item, index}) => (
    <View>
      <View style={styles.ruleContainer}>
        <View style={{marginLeft: 20}}>
          <Text style={[styles.ruleTitle, {fontWeight: '600'}]}>
            {item.title}
          </Text>
          <Text style={styles.textStyle}>Fine:</Text>

          <TextInput
            placeholder={'Enter Fine'}
            style={styles.textInputStyle}
            keyboardType="numeric"
            placeholderTextColor={'grey'}
            onChangeText={text => {
              const newFine = text === '' ? 0 : parseInt(text);
              const ruleIndex = rulesList.findIndex(
                rule => rule.id === item.id,
              );
              if (ruleIndex !== -1) {
                const updatedRulesList = [...rulesList];
                updatedRulesList[ruleIndex].fine = newFine;
                setRulesList(updatedRulesList);
              }
            }}
            value={item.fine.toString()}
          />
          <Text style={styles.textStyle}>Allowed Time:</Text>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setSelectedRuleIndex(index);
            }}
            style={{height: 20}}>
            <View style={[styles.textInputStyle, {height: 50}]}>
              <Text
                style={{
                  fontSize: 16,
                  color:
                    item.allowed_time.hours !== '' &&
                    item.allowed_time.minutes !== '' &&
                    item.allowed_time.seconds !== ''
                      ? 'black'
                      : 'grey',
                }}>
                {item.allowed_time.hours !== '' &&
                item.allowed_time.minutes !== '' &&
                item.allowed_time.seconds !== ''
                  ? `${item.allowed_time.hours
                      .toString()
                      .padStart(2, '0')}:${item.allowed_time.minutes
                      .toString()
                      .padStart(2, '0')}:${item.allowed_time.seconds
                      .toString()
                      .padStart(2, '0')}`
                  : 'Select Time'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <CheckBox
          disabled={false}
          value={item.checkBox}
          onValueChange={() => handleCheckBoxChange(item)}
          style={styles.checkBoxStyle}
          color={'#2196F3'}
        />
      </View>
      <View style={styles.horizontalLineStyle}></View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextField
          placeHolder="Section Name"
          value={inputText}
          onChangeText={text => setInputText(text)}
          style={styles.textInputStyle}
        />
        <Text style={[styles.textStyle, {fontSize: 21, fontWeight: 'bold'}]}>
          Rules
        </Text>
        <FlatList
          data={rulesList}
          renderItem={renderRuleItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
          refreshControl={
            // Adding RefreshControl
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchProductivityRules(); // Refreshing data
              }}
            />
          }
        />
        <View style={styles.buttonWrapper}>
          <ButtonComponent
            title="Confirm Section"
            onPress={handleConfirmSection}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Hours:</Text>
                <TextInput
                  placeholder="Hours"
                  style={styles.modalTextInput}
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                  onChangeText={time => {
                    const newTime = time === '' ? 0 : parseInt(time);
                    if (selectedRuleIndex !== null) {
                      const updatedRulesList = [...rulesList];
                      updatedRulesList[selectedRuleIndex].allowed_time.hours =
                        newTime;
                      setRulesList(updatedRulesList);
                    }
                  }}
                />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Minutes:</Text>
                <TextInput
                  placeholder="Minutes"
                  style={styles.modalTextInput}
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                  onChangeText={time => {
                    const newTime = time === '' ? 0 : parseInt(time);
                    if (selectedRuleIndex !== null) {
                      const updatedRulesList = [...rulesList];
                      updatedRulesList[selectedRuleIndex].allowed_time.minutes =
                        newTime;
                      setRulesList(updatedRulesList);
                    }
                  }}
                />
              </View>
              <View style={styles.modalRow}>
                <Text style={styles.modalLabel}>Seconds:</Text>
                <TextInput
                  placeholder="Seconds"
                  style={styles.modalTextInput}
                  placeholderTextColor={'grey'}
                  keyboardType="numeric"
                  onChangeText={time => {
                    const newTime = time === '' ? 0 : parseInt(time);
                    if (selectedRuleIndex !== null) {
                      const updatedRulesList = [...rulesList];
                      updatedRulesList[selectedRuleIndex].allowed_time.seconds =
                        newTime;
                      setRulesList(updatedRulesList);
                    }
                  }}
                />
              </View>
              <Button
                title="Done"
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 15,
  },
  textInputStyle: {
    fontSize: 16,
    marginTop: 5,
    marginLeft: 20,
    width: 100,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
  },
  ruleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleTitle: {
    fontSize: 19,
    marginTop: 25,
    marginLeft: 20,
    color: 'black',
  },
  checkBoxStyle: {
    marginTop: 30,
    marginRight: 20,
  },
  textStyle: {
    fontSize: 17,
    marginTop: 10,
    marginLeft: 20,
    color: 'black',
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'black',
  },
  modalTextInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    padding: 8,
    color: 'black',
  },
  horizontalLineStyle: {
    width: '90%',
    height: 1,
    backgroundColor: 'black',
    marginTop: 45,
    alignSelf: 'center',
  },
});

export default EditSection;
