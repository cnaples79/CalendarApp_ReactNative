import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import CalendarService from '../../services/CalendarService';

export default function EventDetailsModal() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const event = eventId ? CalendarService.getEventById(eventId) : null;

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Event not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.time}>
        {event.startTime.toLocaleString()} - {event.endTime.toLocaleString()}
      </Text>
      {event.description && <Text style={styles.description}>{event.description}</Text>}
      <Button 
        title="Edit"
        onPress={() => router.push({ pathname: '/event-modal', params: { eventId: event.id } })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  time: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
  },
});
