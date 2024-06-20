import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loaded] = useFonts({
    'JosefinSans-Regular': require('../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf'),
    'JosefinSans-Bold': require('../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf'),
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
      <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
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