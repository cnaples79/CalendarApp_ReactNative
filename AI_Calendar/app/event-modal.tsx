import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CalendarService from '../services/CalendarService';

export default function EventModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const params = useLocalSearchParams();
  const eventId = params.eventId as string | undefined;

  useEffect(() => {
    if (eventId) {
      const event = CalendarService.getEventById(eventId);
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
      CalendarService.updateEvent(eventId, title, description);
    } else {
      CalendarService.createEvent(title, description);
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
