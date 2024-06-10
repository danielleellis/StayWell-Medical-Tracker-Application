// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/screens/Home/Home';
import CalendarScreen from './src/screens/Calendar/CalendarScreen';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Home />
        {/* <Text>
          This is a good response.
        </Text> */}
        <CalendarScreen />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
