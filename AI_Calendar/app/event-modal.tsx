import { View, Text, StyleSheet } from 'react-native';

export default function EventModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add/Edit Event</Text>
      {/* Event form will go here */}
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
});
