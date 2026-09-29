import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import ToastAndroid from '../utils/Toast';
import PrimaryAppBar from '../components/PrimaryAppBar';
import {API_URL} from '../../apiConfig';
import {SwiperFlatList} from 'react-native-swiper-flatlist';

const ViolationDetails = props => {
  const [employeeViolationDetail, setEmployeeViolationDetail] = useState(null);

  const formatDate = dateStr => {
    const date = new Date(dateStr);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const {item, name, isGuest} = props.route.params;
  useEffect(() => {
    fetchViolationDetails();
  }, []);
  const fetchViolationDetails = async () => {
    try {
      console.log(item.violation_id);
      const url = isGuest
        ? `${API_URL}/Employee/GetGuestViolationDetails?violation_id=${item.violation_id}`
        : `${API_URL}/Employee/GetViolationDetails?violation_id=${item.violation_id}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('dsa', data);
      setEmployeeViolationDetail(data);
    } catch (error) {
      ToastAndroid.show(
        'Error fetching employee Violations:',
        ToastAndroid.SHORT,
      );
    }
  };
  return (
    <View style={styles.container}>
      <PrimaryAppBar text={name} />
      {employeeViolationDetail && employeeViolationDetail.images && (
        <View style={styles.swiperContainer}>
          <SwiperFlatList index={0}>
            {employeeViolationDetail.images.map((image, index) => (
              <View style={styles.slide} key={index}>
                <View style={styles.imageContainer}>
                  <Image
                    resizeMode="contain"
                    source={{
                      uri: `${API_URL}/ViolationImages/${encodeURIComponent(
                        image.image_url.replace(/\\/g, '/'),
                      )}`,
                    }}
                    style={styles.imageStyle}
                  />
                </View>
                <Text style={styles.dateStyle}>{image.capture_time}</Text>
              </View>
            ))}
          </SwiperFlatList>
        </View>
      )}
      {employeeViolationDetail && (
        <View style={styles.detailsContainer}>
          <Text style={[styles.dateStyle, {fontWeight: 'bold'}]}>
            {employeeViolationDetail.rule_name}
          </Text>
          <Text style={styles.dateStyle}>
            {!isGuest && formatDate(employeeViolationDetail.date)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  titleStlye: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginTop: 10,
  },
  swiperContainer: {
    height: 380,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '3%',
    borderRadius: 30,
  },
  slide: {
    width: 393,
    alignItems: 'center',
  },
  imageContainer: {
    width: 393,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  dateStyle: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
    marginTop: 10, // Add some space between the image and the date
  },
});
export default ViolationDetails;
