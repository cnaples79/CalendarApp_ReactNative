import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Button, ScrollView, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import CalendarGrid from '../../components/CalendarGrid';
import DailyTimeline from '../../components/DailyTimeline';
import CalendarService from '../../services/CalendarService';
import { Event } from '../../types/Event';
import { DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkingProps }>({});
  const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([]);
    const [selectedDay, setSelectedDay] = useState<DateData | null>(null);
  const router = useRouter();

  const fetchData = useCallback(() => {
    const allEvents = CalendarService.getAllEvents();
    const newMarkedDates: { [key: string]: MarkingProps } = {};
    allEvents.forEach(event => {
      const dateString = event.startTime.toISOString().split('T')[0];
      newMarkedDates[dateString] = { marked: true, dotColor: 'blue' };
    });
    setMarkedDates(newMarkedDates);

    if (selectedDay) {
      const eventsForDay = CalendarService.getEventsForDate(new Date(selectedDay.dateString));
      setSelectedDayEvents(eventsForDay);
    }
  }, [selectedDay]);

  useFocusEffect(fetchData);

  const onDayPress = (day: DateData) => {
    setSelectedDay(day);
    const events = CalendarService.getEventsForDate(new Date(day.dateString));
    setSelectedDayEvents(events);
  };

  return (
    <ScrollView style={styles.container}>
      <Link href="/event-modal" asChild>
        <Button title="Add New Event" />
      </Link>
      <CalendarGrid markedDates={markedDates} onDayPress={onDayPress} />
            {selectedDay && <DailyTimeline events={selectedDayEvents} />}
      <FlatList
        data={selectedDayEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItemContainer}>
            <TouchableOpacity 
              style={styles.eventTouchable}
              onPress={() => router.push({ pathname: '/modal/event-details', params: { eventId: item.id } })}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              {item.description && <Text>{item.description}</Text>}
            </TouchableOpacity>
            <Button title="Delete" color="red" onPress={() => {
              Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => {
                  CalendarService.deleteEvent(item.id);
                  fetchData(); // Refresh UI
                }},
              ]);
            }} />
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  eventItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventTouchable: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
  },
});
