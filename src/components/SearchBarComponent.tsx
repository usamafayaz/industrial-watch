import React, {useState} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '@expo/vector-icons/MaterialIcons';

const SearchBarComponent = (props: {onSearch: any; placeHolder: string}) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    props.onSearch(query);
  };

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          onPress={() => {
            handleSearch();
          }}>
          <Icon name="search" size={23} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder={props.placeHolder}
          onChangeText={text => setQuery(text)}
          onSubmitEditing={handleSearch}
          value={query}
          placeholderTextColor={'grey'}
        />
        <TouchableOpacity
          onPress={() => {
            setQuery('');
          }}>
          <Icon name="close" size={23} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 20,
    height: 55,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: 'black',
  },
});

export default SearchBarComponent;
