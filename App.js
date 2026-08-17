import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from "./Navigation/AppNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <AppNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
