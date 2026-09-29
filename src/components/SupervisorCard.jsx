import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const SupervisorCard = ({id, name, sections}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.sectionText}>{sections}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Edit Supervisor', {id});
          }}>
          <Icon name="edit" size={25} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    height: 75,
    backgroundColor: '#E5E5E5',
    borderRadius: 20,
    paddingLeft: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '4%',
    alignSelf: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  nameText: {
    color: '#3A3A3A',
    fontSize: 19,
    fontWeight: '600',
  },
  sectionText: {
    color: '#8D8D8D',
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
  },
});

export default SupervisorCard;
