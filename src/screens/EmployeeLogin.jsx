import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import EmployeeAttendance from './EmployeeAttendance';
import EmployeeViolation from './EmployeeViolation';
import EmployeeLoginHome from './EmployeeLoginHome';
import EmployeeProfile from './EmployeeProfile';
import Icon from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const EmployeeLogin = props => {
  const {id, name, user_role} = props.route.params.data;
  const employee = {employee_id: id, name, user_role};
  const navigation = useNavigation();
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarInactiveTintColor: 'grey',
          tabBarActiveTintColor: '#2367CE',
          headerTintColor: 'white',
          tabBarShowLabel: false,
          headerStyle: {
            height: 0,
          },

          tabBarStyle: {height: 55},
          tabBarIcon: ({color}) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Attendance') iconName = 'event';
            else if (route.name === 'Violations') iconName = 'block';
            else if (route.name === 'Profile') iconName = 'person';

            return <Icon name={iconName} size={22} color={color} />;
          },
        })}>
        <Tab.Screen
          name="Home"
          component={EmployeeLoginHome}
          initialParams={{employee: employee}}
        />
        <Tab.Screen
          name="Attendance"
          component={EmployeeAttendance}
          options={{headerShown: false}}
          initialParams={{employee: employee}}
        />
        <Tab.Screen
          name=" "
          component={EmployeeLoginHome}
          initialParams={{employee: employee}}
        />
        <Tab.Screen
          name="Violations"
          component={EmployeeViolation}
          options={{headerShown: false}}
          initialParams={{employee: employee}}
        />
        <Tab.Screen
          name="Profile"
          component={EmployeeProfile}
          options={{headerShown: false}}
          initialParams={{employee: employee}}
        />
      </Tab.Navigator>
      <TouchableOpacity
        style={styles.floatingButtonStyle}
        onPress={() => {
          navigation.navigate('Employee Summary', {employee});
        }}>
        <Icon name="summarize" size={25} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2367CE',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 27,
    right: '43%',
  },
  imageStyle: {marginRight: 12, height: 40, width: 40},
});

export default EmployeeLogin;
