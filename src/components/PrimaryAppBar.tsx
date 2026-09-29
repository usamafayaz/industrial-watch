import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
const PrimaryAppBar = (props: {text: string; arrowNotRequired?: boolean}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor:
          props.text == 'Employee Productivity' ||
          props.text == 'Add Employee' ||
          props.text == 'Production' ||
          props.text == 'Add Batch' ||
          props.text == 'Add Guest'
            ? '#2196F3'
            : '#FFFFFF',
      }}>
      <View style={styles.rowContainer}>
        {props.arrowNotRequired ? null : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={30}
              color={'white'}
              style={{backgroundColor: '#2196F3', borderRadius: 30, padding: 5}}
            />
          </TouchableOpacity>
        )}
        <Text style={styles.headerStyle}>{props.text}</Text>
      </View>
    </View>
  );
};

export default PrimaryAppBar;

const styles = StyleSheet.create({
  rowContainer: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerStyle: {
    flex: 1,
    fontSize: 23,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 30,
  },
});
