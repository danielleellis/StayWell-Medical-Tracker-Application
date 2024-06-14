import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { verifyEmail } from '../redux/slices/authSlice';
import { useFonts } from 'expo-font';

const EmailVerificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const email = useSelector((state: RootState) => state.auth.user?.email);

  const code2Ref = useRef<TextInput>(null);
  const code3Ref = useRef<TextInput>(null);
  const code4Ref = useRef<TextInput>(null);

  const [loaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleVerifyEmail = () => {
    const verificationCode = code1 + code2 + code3 + code4;
    dispatch(verifyEmail(verificationCode));
    navigation.navigate('ProfileSetup');
  };

  const handleResendCode = () => {
    // Implement the logic to resend the verification code to the user's email
    console.log('Resend verification code to:', email);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/sun.png')} style={styles.logo} />
      <Text style={styles.title}>Verify Email</Text>
      <Text style={styles.description}>
        Please enter the verification code sent to: {email}
      </Text>
      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.codeInput}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(text) => {
            setCode1(text);
            if (text.length === 1) {
              code2Ref.current?.focus();
            }
          }}
        />
        <TextInput
          ref={code2Ref}
          style={styles.codeInput}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(text) => {
            setCode2(text);
            if (text.length === 1) {
              code3Ref.current?.focus();
            }
          }}
        />
        <TextInput
          ref={code3Ref}
          style={styles.codeInput}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={(text) => {
            setCode3(text);
            if (text.length === 1) {
              code4Ref.current?.focus();
            }
          }}
        />
        <TextInput
          ref={code4Ref}
          style={styles.codeInput}
          keyboardType="number-pad"
          maxLength={1}
          onChangeText={setCode4}
        />
      </View>
      <Button
        title="Next"
        onPress={handleVerifyEmail}
        disabled={!code1 || !code2 || !code3 || !code4}
      />
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
    padding: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: 60,
    height: 60,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  resendCodeText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Regular',
  },
});

export default EmailVerificationScreen;