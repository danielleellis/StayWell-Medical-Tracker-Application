import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { verifyEmail } from '../redux/slices/authSlice';
import { useFonts } from 'expo-font';

const EmailVerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleVerifyEmail = () => {
    dispatch(verifyEmail(verificationCode));
    navigation.navigate('ProfileSetup');
  };

  const handleResendCode = () => {
    // Implement the logic to resend the verification code to the user's email
    console.log('Resend verification code to:', email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.description}>
        Please enter the verification code sent to your email address.
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Input
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={setVerificationCode}
        style={styles.input}
      />
      <Button title="Verify Email" onPress={handleVerifyEmail} disabled={!verificationCode} />
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendCodeText}>Resend Verification Code</Text>
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
    color: '#45A6FF',
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    marginBottom: 16,
  },
  resendCodeText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Regular',
  },
});

export default EmailVerificationScreen;