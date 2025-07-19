import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import calendarService from '../services/CalendarService';

export default function EventModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string | undefined;

  useEffect(() => {
    if (eventId) {
      const event = calendarService.getEventById(eventId as string);
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
      }
    }
  }, [eventId]);

    const handleSave = () => {
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }

    if (eventId) {
      // Note: Manual update doesn't support changing time yet.
            calendarService.updateEvent(eventId as string, title, description);
    } else {
      const now = new Date();
            calendarService.createEvent(title, now.toISOString(), now.toISOString(), description);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add/Edit Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Save Event" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});
