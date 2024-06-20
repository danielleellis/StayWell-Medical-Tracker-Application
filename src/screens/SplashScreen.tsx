import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loaded] = useFonts({
    'JosefinSans-Regular': require('../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf'),
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
      <View style={styles.content}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.tagline}>
          PUTTING THE
          {'\n'}
          SELF-CARE in HEALTHCARE
        </Text>
      </View>
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
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 350,
    height: 350,
  },
  tagline: {
    marginTop: -80,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'JosefinSans-Regular',
    color: '#B1DAB6',
  },
});

export default SplashScreen;
