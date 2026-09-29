import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
const SecondaryAppBar = (props: {text: string}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon
          name="arrow-back"
          size={30}
          color={'white'}
          style={{backgroundColor: '#2196F3', borderRadius: 30, padding: 5}}
        />
      </TouchableOpacity>
      <Text style={styles.headerStyle}>{props.text}</Text>
    </View>
  );
};

export default SecondaryAppBar;

const styles = StyleSheet.create({
  rowContainer: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingLeft: 20,
  },
  headerStyle: {
    fontSize: 23,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 30,
  },
});
