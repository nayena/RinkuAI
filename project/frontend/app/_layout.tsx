import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PeopleProvider } from '../src/context/PeopleContext';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <PeopleProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="edit/[id]" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </PeopleProvider>
  );
}
