import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';

interface CalendarGridProps {
  markedDates: { [key: string]: MarkingProps };
  onDayPress: (day: DateData) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ markedDates, onDayPress }) => {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        firstDay={1} // Monday
        markedDates={markedDates}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
});

export default CalendarGrid;
