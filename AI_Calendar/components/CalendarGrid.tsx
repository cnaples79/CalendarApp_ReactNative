import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';
import CalendarService from '../services/CalendarService';
import { Event } from '../types/Event';

const CalendarGrid = () => {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkingProps }>({});
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);

  useEffect(() => {
    const events = CalendarService.getAllEvents();
    const newMarkedDates: { [key: string]: MarkingProps } = {};
    events.forEach(event => {
      const dateString = event.startTime.toISOString().split('T')[0];
      newMarkedDates[dateString] = { marked: true, dotColor: 'blue' };
    });
    setMarkedDates(newMarkedDates);
  }, []);

  const onDayPress = (day: DateData) => {
    const events = CalendarService.getEventsForDate(new Date(day.dateString));
    setSelectedDayEvents(events);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        hideExtraDays={true}
        firstDay={1} // Monday
        markedDates={markedDates}
      />
      <FlatList
        data={selectedDayEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            {item.description && <Text>{item.description}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventTitle: {
    fontWeight: 'bold',
  },
});

export default CalendarGrid;
