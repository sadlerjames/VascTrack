import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true, animationEnabled: true, }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chatBot" />
    </Stack>
  );
}
