import { Stack } from 'expo-router';

export default function RecordStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* This maps to record/index.js */}
      <Stack.Screen name="symptoms" />
      <Stack.Screen name="medication" />
      <Stack.Screen name="energy" />
    </Stack>
  );
}
