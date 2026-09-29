import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@expo/vector-icons/MaterialIcons';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Pure-JS replacement for react-native-month-year-picker.
// onChange(event, date) is called with 'dateSetAction' or 'dismissedAction'.
const MonthYearPicker = ({value, onChange, minimumDate, maximumDate}) => {
  const [year, setYear] = useState(value.getFullYear());
  const [month, setMonth] = useState(value.getMonth());

  const toIndex = date => date.getFullYear() * 12 + date.getMonth();
  const isDisabled = m => {
    const index = year * 12 + m;
    return (
      (minimumDate && index < toIndex(minimumDate)) ||
      (maximumDate && index > toIndex(maximumDate))
    );
  };

  return (
    <Modal
      isVisible
      onBackdropPress={() => onChange('dismissedAction', undefined)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setYear(year - 1)}>
            <Icon name="chevron-left" size={30} color="#2196F3" />
          </TouchableOpacity>
          <Text style={styles.year}>{year}</Text>
          <TouchableOpacity onPress={() => setYear(year + 1)}>
            <Icon name="chevron-right" size={30} color="#2196F3" />
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          {MONTHS.map((name, m) => {
            const disabled = isDisabled(m);
            const selected = m === month;
            return (
              <TouchableOpacity
                key={name}
                disabled={disabled}
                onPress={() => setMonth(m)}
                style={[styles.month, selected && styles.selected]}>
                <Text
                  style={[
                    styles.monthText,
                    selected && styles.selectedText,
                    disabled && styles.disabledText,
                  ]}>
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onChange('dismissedAction', undefined)}>
            <Text style={styles.action}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDisabled(month)}
            onPress={() => onChange('dateSetAction', new Date(year, month, 1))}>
            <Text style={styles.action}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', borderRadius: 12, padding: 16},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  year: {fontSize: 20, fontWeight: 'bold', color: 'black'},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  month: {
    width: '33.33%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selected: {backgroundColor: '#2196F3'},
  monthText: {fontSize: 16, color: 'black'},
  selectedText: {color: 'white', fontWeight: 'bold'},
  disabledText: {color: '#BDBDBD'},
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 24,
    marginTop: 12,
  },
  action: {fontSize: 16, fontWeight: 'bold', color: '#2196F3'},
});

export default MonthYearPicker;
