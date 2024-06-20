import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { forgotPassword } from '../redux/slices/authSlice';
import { useFonts } from 'expo-font';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    'JosefinSans-Regular': require('../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf'),
    'JosefinSans-Bold': require('../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleForgotPassword = () => {
    dispatch(forgotPassword(email));
    // Navigate to a success screen or show a success message
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/sun.png')} style={styles.logo} />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you a link to reset your password.
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Button title="Send Reset Link" onPress={handleForgotPassword} disabled={!email} />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.backToSignInText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#6BB7ED',
    fontFamily: 'JosefinSans-Regular',
  },
  logo: {
    width: 240,
    height: 75,
    alignSelf: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'JosefinSans-Regular',
  },
  input: {
    marginBottom: 16,
  },
  backToSignInText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6BB7ED',
    fontFamily: 'JosefinSans-Regular',
  },
});

export default ForgotPasswordScreen;