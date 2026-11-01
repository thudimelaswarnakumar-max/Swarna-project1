import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Placement Analyzer',
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          title: 'Student Registration',
        }}
      />

      <Stack.Screen
        name="assessment"
        options={{
          title: 'Skill Assessment',
        }}
      />
      <Stack.Screen
  name="results"
  options={{
    title: 'Assessment Results',
  }}
/>
    </Stack>
  );
}