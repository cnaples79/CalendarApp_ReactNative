import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Link } from 'expo-router';
import CalendarGrid from '../../components/CalendarGrid';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Link href="/event-modal" asChild>
        <Button title="Add New Event" />
      </Link>
      <CalendarGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
