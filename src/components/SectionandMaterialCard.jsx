import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

const SectionandMaterialCard = ({
  id,
  title,
  archiveRequired,
  onArchivePress,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardText}>{title}</Text>
      <View style={styles.iconContainer}>
        {archiveRequired && (
          <TouchableOpacity
            onPress={() => {
              onArchivePress(id);
            }}>
            <Icon name="archive" size={26} color="black" style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '90%',
    height: 55,
    backgroundColor: '#DDDDDD',
    borderRadius: 20,
    paddingLeft: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '4%',
  },
  cardText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
  },
});

export default SectionandMaterialCard;
