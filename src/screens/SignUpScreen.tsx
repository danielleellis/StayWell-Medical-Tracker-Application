import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { signUp } from '../redux/slices/authSlice';

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const handleSignUp = () => {
    const userData = {
      firstName,
      lastName,
      email,
      username,
      password,
      pronouns,
      phone,
      birthday,
    };
    dispatch(signUp(userData));
    navigation.navigate('EmailVerification');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Input placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <Input placeholder="Email" value={email} onChangeText={setEmail} />
      <Input placeholder="Username" value={username} onChangeText={setUsername} />
      <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Input placeholder="Pronouns" value={pronouns} onChangeText={setPronouns} />
      <Input placeholder="Phone" value={phone} onChangeText={setPhone} />
      <Input placeholder="Birthday" value={birthday} onChangeText={setBirthday} />
      <Button title="Sign Up" onPress={handleSignUp} />
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

export default SignUpScreen;
