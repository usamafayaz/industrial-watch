import React, {useCallback, useState} from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import Icon from '@expo/vector-icons/MaterialIcons';
import {API_URL} from '../../apiConfig';
const EmployeeProfile = props => {
  const employee = props.route.params.employee;
  const [employeeDetail, setEmployeeDetail] = useState({});

  useFocusEffect(
    useCallback(() => {
      fetchEmployeeProfile();
    }, []),
  );

  const fetchEmployeeProfile = async () => {
    const response = await fetch(
      `${API_URL}/Employee/GetEmployeeProfile?employee_id=${employee.employee_id}`,
    );
    const data = await response.json();
    setEmployeeDetail(data);
  };
  const navigation = useNavigation();
  const [modalVisibility, setModalVisibility] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.design}>
        <View style={styles.rowContainer}>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Edit Profile', {
                employeeDetail,
                employee,
              });
            }}>
            <Icon name="edit" size={23} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.whiteDesign}></View>
      <View style={styles.imageContainer}>
        <Image
          resizeMode="cover"
          source={{
            uri: `${API_URL}/EmployeeImage/${
              employee.employee_id
            }/${encodeURIComponent(employeeDetail.image)}`,
          }}
          style={styles.imageStyle}
        />
      </View>
      <Text style={styles.nameStyle}>{employeeDetail.name}</Text>
      <Text style={styles.roleStyle}>{employeeDetail.username}</Text>
      <View style={styles.rowField}>
        <Icon name="diversity-1" size={20} color={'#2196F3'} />
        <Text style={styles.textStyle}>{employeeDetail.job_role}</Text>
      </View>
      <View style={styles.rowField}>
        <Icon name="factory" size={20} color={'#2196F3'} />
        <Text style={styles.textStyle}>{employeeDetail.section}</Text>
      </View>
      <View style={styles.rowField}>
        <Icon name="schedule" size={20} color={'#2196F3'} />
        <Text style={styles.textStyle}>{employeeDetail.job_type}</Text>
      </View>
      <TouchableOpacity
        style={[styles.rowField, styles.logoutButton]}
        onPress={() => {
          setModalVisibility(true);
        }}>
        <Icon name="logout" size={22} color="#EB5757" />
        <Text style={[styles.textStyle, {color: '#EB5757'}]}>Logout</Text>
      </TouchableOpacity>
      <Modal isVisible={modalVisibility}>
        <View style={styles.modalWrapper}>
          <Text style={styles.confirmationMessage}>
            Do you really want to Logout?
          </Text>
          <View style={styles.modalButtonWrapper}>
            <TouchableOpacity onPress={() => setModalVisibility(false)}>
              <Text style={styles.cancelStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisibility(false);
                navigation.navigate('Login');
              }}>
              <Text style={styles.OKStyle}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 18,
  },
  headerText: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  imageContainer: {
    backgroundColor: '#c5e3e1',
    padding: 30,
    borderRadius: 600,
    position: 'absolute',
    top: 95,
    height: 100,
    width: 100,
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 60,
    position: 'absolute',
  },
  design: {
    backgroundColor: '#2196F3',
    height: 140,
    width: '100%',
    borderBottomRightRadius: 140,
    borderBottomLeftRadius: 140,
    marginBottom: 55,
  },
  whiteDesign: {
    backgroundColor: 'white',
    borderRadius: 600,
    position: 'absolute',
    height: 110,
    width: 110,
    top: 90,
  },
  nameStyle: {color: 'black', fontSize: 24, fontWeight: 'bold'},
  roleStyle: {color: 'black', fontSize: 18, marginBottom: '10%'},
  rowField: {
    backgroundColor: '#F6F6F6',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    height: '7%',
    marginBottom: '3%',
  },
  logoutButton: {
    justifyContent: 'center',
    borderColor: '#BBBBBB',
    borderWidth: 1,
    marginTop: 30,
  },
  textStyle: {color: 'black', fontSize: 18, marginLeft: 20},
  confirmationMessage: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  modalWrapper: {
    paddingLeft: '5%',
    paddingTop: '5%',
    backgroundColor: 'white',
    height: '18%',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    marginLeft: '50%',
    marginTop: '12%',
  },
  cancelStyle: {
    color: '#2196F3',
    marginRight: 10,
    paddingVertical: '5%',
  },
  OKStyle: {
    color: 'white',
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
});
export default EmployeeProfile;
