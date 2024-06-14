import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        navigation.replace('SignUp');
      }, 3000); // Display the splash screen for 3 seconds
    }
  }, [loaded, navigation]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 240,
    height: 240,
  },
});

export default SplashScreen;