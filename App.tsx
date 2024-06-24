import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import _layout from './src/(tabs)/_layout';


//not sure if i can have <_layout/> here too, had error switched out navigation to test
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
      <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;