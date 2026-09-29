import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';
import {useNavigation} from '@react-navigation/native';
//🥇🥈🥉
const EmployeeRanking = () => {
  const [employees, setEmployees] = useState([]);
  const [sectionsList, setSectionList] = useState([
    {key: -1, value: 'All Sections'},
  ]);
  const [selectedSection, setSelectedSection] = useState('');
  const navigation = useNavigation();
  useEffect(() => {
    fetchData(`${API_URL}/Section/GetAllSections?status=${1}`);
    fetchAllEmployees(
      `${API_URL}/Employee/GetAllEmployees?section_id=${-1}&ranking_required=${1}`,
    );
  }, []);

  useEffect(() => {
    if (selectedSection !== '') {
      fetchAllEmployees(
        `${API_URL}/Employee/GetAllEmployees?section_id=${selectedSection}&ranking_required=${1}`,
      );
    }
  }, [selectedSection]);

  const fetchData = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      const formattedData = data.map(item => ({
        key: item.id.toString(),
        value: item.name,
      }));

      setSectionList(prevSections => [...prevSections, ...formattedData]);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
    }
  };
  const fetchAllEmployees = async url => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      ToastAndroid.show(
        'Failed to fetch data. Please try again.',
        ToastAndroid.SHORT,
      );
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{width: '104%', marginTop: '2%'}}>
        <SelectListComponent
          setSelected={setSelectedSection}
          data={sectionsList}
          placeholder="All Section"
          customStyle={{width: '92%'}}
        />
      </View>

      <FlatList
        data={employees}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => {
              navigation.navigate('Employee Detail', {employee: item});
            }}>
            {index === 0 && <Text style={styles.badgeStyle}>🥇</Text>}
            {index === 1 && <Text style={styles.badgeStyle}>🥈</Text>}
            {index === 2 && <Text style={styles.badgeStyle}>🥉</Text>}
            <Image
              resizeMode="cover"
              source={{
                uri: `${API_URL}/EmployeeImage/${
                  item.employee_id
                }/${encodeURIComponent(item.image)}`,
              }}
              style={styles.image}
              borderRadius={30}
            />
            <Text style={styles.nameStyle}>{item.name}</Text>
            <Text style={styles.productivityStyle}>
              {item.productivity.toFixed(1)}%
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectListStyle: {
    backgroundColor: '#E5E5E5',
    borderColor: '#E5E5E5',
    borderRadius: 20,
    marginTop: '2%',
  },
  selectListInput: {color: 'black', fontSize: 18},
  rowContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    paddingHorizontal: '10%',
    justifyContent: 'space-evenly',
  },
  image: {
    width: 50,
    height: 50,
    marginRight: '10%',
  },
  productivityStyle: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  nameStyle: {
    fontSize: 19,
    color: 'black',
    fontWeight: 'bold',
    marginRight: '30%',
  },
  badgeStyle: {
    fontSize: 25,
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 10,
  },
});

export default EmployeeRanking;
