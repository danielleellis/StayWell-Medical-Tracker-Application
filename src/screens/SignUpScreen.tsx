import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signUp } from '../redux/slices/authSlice';
import { useFonts } from 'expo-font';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleNext = () => {
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };
    dispatch(signUp(userData));
    navigation.navigate('EmailVerification');
  };

  const isFormValid = () => {
    return firstName !== '' && lastName !== '' && email !== '' && password !== '';
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/sun.png')} style={styles.logo} />
      <Text style={styles.title}>Create an Account</Text>
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Next" onPress={handleNext} disabled={!isFormValid()} />
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
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
  logo: {
    width: 240,
    height: 75,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    marginBottom: 16,
  },
  signInText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Regular',
  },
});

export default SignUpScreen;