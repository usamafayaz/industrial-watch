import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ToastAndroid from '../utils/Toast';
import SearchBarComponent from '../components/SearchBarComponent';
import EmployeeCard from '../components/EmployeeCard';
import SelectListComponent from '../components/SelectListComponent';
import {API_URL} from '../../apiConfig';

const EmployeeRecord = () => {
  const [sectionsList, setSectionList] = useState([
    {key: -1, value: 'All Sections'},
  ]);
  const [employees, setEmployees] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData(`${API_URL}/Section/GetAllSections?status=${1}`);
    fetchAllEmployees(
      `${API_URL}/Employee/GetAllEmployees?section_id=${-1}&ranking_required=${0}`,
    );
  }, []);

  useEffect(() => {
    if (selectedSection !== '') {
      fetchAllEmployees(
        `${API_URL}/Employee/GetAllEmployees?section_id=${selectedSection}&ranking_required=${0}`,
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
  const handleSearch = text => {
    if (!text)
      fetchAllEmployees(
        `${API_URL}/Employee/GetAllEmployees?section_id=${-1}&ranking_required=${0}`,
      );
    else {
      setSearchText(text);
      const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(text.toLowerCase()),
      );
      setEmployees(filteredEmployees);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{width: '104%'}}>
        <SelectListComponent
          setSelected={setSelectedSection}
          data={sectionsList}
          placeholder="All Section"
        />
      </View>
      <SearchBarComponent
        onSearch={handleSearch}
        placeHolder="Search Employee"
      />
      <EmployeeCard employees={employees} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: '4%',
  },
});

export default EmployeeRecord;
