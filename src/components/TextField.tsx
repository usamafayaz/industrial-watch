import React, {useState} from 'react';
import {TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';

const TextField = (props: {
  placeHolder: string;
  eyeIcon?: boolean;
  onChangeText: any;
  value: any;
}) => {
  const [showPassword, setShowPassword] = useState(props.eyeIcon);
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={props.placeHolder}
        style={styles.inputStyle}
        secureTextEntry={showPassword}
        placeholderTextColor={'grey'}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      {props.eyeIcon && (
        <TouchableOpacity
          style={{position: 'absolute', right: 1, top: 14}}
          onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome5
            name={showPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="black"
            style={{marginRight: 10}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '86%',
    height: 50,
    marginVertical: 7,
  },
  inputStyle: {
    width: '100%',
    flex: 1,
    fontSize: 18,
    borderRadius: 20,
    padding: 10,
    paddingLeft: 20,
    backgroundColor: '#E5E5E5',
    color: 'black',
  },
});

export default TextField;