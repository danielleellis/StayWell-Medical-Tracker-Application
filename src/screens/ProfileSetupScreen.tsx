import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setupProfile } from '../redux/slices/authSlice';

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [profilePhoto, setProfilePhoto] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleProfileSetup = () => {
    dispatch(setupProfile(profilePhoto));
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Profile</Text>
      <Input placeholder="Profile Photo URL" value={profilePhoto} onChangeText={setProfilePhoto} />
      <Button title="Complete Profile" onPress={handleProfileSetup} />
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

export default ProfileSetupScreen;
