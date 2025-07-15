import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event-modal" options={{ presentation: 'modal', title: 'Add/Edit Event' }} />
      <Stack.Screen name="modal/event-details" options={{ presentation: 'modal', title: 'Event Details' }} />
    </Stack>
  );
}

