import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      <Stack.Screen name="(app)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="index" options={{ gestureEnabled: false }} />
      <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      <Stack.Screen name="register" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
