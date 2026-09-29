import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import CheckBox from 'expo-checkbox';

interface Rule {
  id: number;
  title: string;
  checkBox: boolean;
  fine: Number;
  allowedTime: string;
  // Add more properties if necessary
}
const RuleComponent = (props: {
  title: string;
  fine: Number;
  checkBox: boolean;
}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(props.checkBox);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState({hours: '', minutes: ''});

  const handleCheckBoxChange = () => {
    setToggleCheckBox(!toggleCheckBox);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDone = () => {
    // Handle the selected time, you can perform any actions here
    console.log('Selected Time:', selectedTime);
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={{marginLeft: 20}}>
          <Text style={styles.textStyle}>{props.title}</Text>
          <TextInput
            placeholder={props.fine == 0 ? 'Enter Fine' : props.fine.toString()}
            style={styles.textInputStyle}
            keyboardType="numeric"
            placeholderTextColor={props.fine == 0 ? 'grey' : 'black'}
            editable={toggleCheckBox}
          />
          <Text style={styles.textStyle}>Time:</Text>
          <TouchableOpacity onPress={openModal} style={{height: 20}}>
            <View style={[styles.textInputStyle, {height: 50}]}>
              <Text
                style={{
                  fontSize: 16,
                  color:
                    selectedTime.hours !== '' && selectedTime.minutes !== ''
                      ? 'black'
                      : 'grey',
                }}>
                {selectedTime.hours !== '' && selectedTime.minutes !== ''
                  ? `${selectedTime.hours}:${selectedTime.minutes}`
                  : 'Select Time'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <CheckBox
          disabled={false}
          value={toggleCheckBox}
          onValueChange={handleCheckBoxChange}
          style={styles.boxStyle}
          color={'#2196F3'}
        />
      </View>

      {/* Modal for selecting time */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Hours:</Text>
              <TextInput
                placeholder="Hours"
                style={styles.modalTextInput}
                placeholderTextColor={'grey'}
                keyboardType="numeric"
                onChangeText={text =>
                  setSelectedTime({...selectedTime, hours: text})
                }
              />
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Minutes:</Text>
              <TextInput
                placeholder="Minutes"
                style={styles.modalTextInput}
                placeholderTextColor={'grey'}
                keyboardType="numeric"
                onChangeText={text =>
                  setSelectedTime({...selectedTime, minutes: text})
                }
              />
            </View>
            <Button title="Done" onPress={handleDone} />
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 190,
    flexDirection: 'row',
  },
  boxStyle: {
    marginTop: 30,
    marginLeft: '54%',
    color: 'black',
  },
  textInputStyle: {
    fontSize: 16,
    marginTop: 5,
    width: 100,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    color: 'black',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  clickableTextContainer: {
    marginTop: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
  },
  clickableText: {
    fontSize: 16,
    color: 'black',
    paddingLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%', // Set the width to 80% of the screen
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
});

export default RuleComponent;
