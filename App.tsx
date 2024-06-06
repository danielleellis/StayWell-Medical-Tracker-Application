// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/screens/Home';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Home />
        {/* <Text>
          This is a good response.
        </Text> */}
      </View>
    </Provider>
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
