import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Button, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import CalendarGrid from '../../components/CalendarGrid';
import DailyTimeline from '../../components/DailyTimeline';
import CalendarService from '../../services/CalendarService';
import { Event } from '../../types/Event';
import { DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';

export default function CalendarScreen() {
  const [markedDates, setMarkedDates] = useState<{ [key: string]: MarkingProps }>({});
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedDay, setSelectedDay] = useState<DateData | null>(null);
  const router = useRouter();

  const fetchData = () => {
    const events = CalendarService.getAllEvents();
    setAllEvents(events);

    const newMarkedDates: { [key: string]: MarkingProps } = {};
    events.forEach(event => {
      const dateString = event.startTime.toISOString().split('T')[0];
      newMarkedDates[dateString] = { marked: true, dotColor: 'blue' };
    });
    setMarkedDates(newMarkedDates);
  };

  useFocusEffect(fetchData);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) return [];
    // Appending 'T00:00:00' ensures the date is parsed in the local timezone, not UTC
    return CalendarService.getEventsForDate(new Date(`${selectedDay.dateString}T00:00:00`));
  }, [selectedDay, allEvents]);

  const onDayPress = (day: DateData) => {
    setSelectedDay(day);
  };

  const renderListHeader = () => (
    <View>
      <Link href="/event-modal" asChild>
        <Button title="Add New Event" />
      </Link>
      <CalendarGrid markedDates={markedDates} onDayPress={onDayPress} />
      {selectedDay && <DailyTimeline events={selectedDayEvents} />}
      {selectedDayEvents.length > 0 && <Text style={styles.listHeader}>Events for {selectedDay?.dateString}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Link href="/event-modal" asChild>
        <Button title="Add New Event" />
      </Link>
      <CalendarGrid markedDates={markedDates} onDayPress={onDayPress} />
      
      {selectedDay && <DailyTimeline events={selectedDayEvents} />}

      {selectedDayEvents.length > 0 && (
        <View>
          <Text style={styles.listHeader}>Events for {selectedDay?.dateString}</Text>
          {selectedDayEvents.map(item => (
            <View key={item.id} style={styles.eventItemContainer}>
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
          ))}
        </View>
      )}

      {selectedDay && selectedDayEvents.length === 0 && (
        <Text style={styles.emptyText}>No events for this day.</Text>
      )}

      {!selectedDay && (
        <Text style={styles.emptyText}>Select a day to see events.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  listHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#f7f7f7',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
