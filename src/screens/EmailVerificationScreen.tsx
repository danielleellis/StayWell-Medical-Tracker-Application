import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { verifyEmail } from '../redux/slices/authSlice';

const EmailVerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleVerifyEmail = () => {
    dispatch(verifyEmail(verificationCode));
    navigation.navigate('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Email</Text>
      <Input placeholder="Verification Code" value={verificationCode} onChangeText={setVerificationCode} />
      <Button title="Verify Email" onPress={handleVerifyEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default EmailVerificationScreen;
