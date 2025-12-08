import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Basic placeholder for the modal route so the stack can mount without crashing.
 */
export default function ModalScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Info' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Nothing here yet</Text>
        <Text style={styles.body}>
          This modal route is reserved for future workflows. You can safely ignore it for now.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    color: '#6b7280',
  },
});
