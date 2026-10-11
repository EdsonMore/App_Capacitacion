import { Alert, Platform } from 'react-native';

/** Alert.alert no hace nada en web; usamos window.alert allí. */
export function notify(title: string, message?: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}
