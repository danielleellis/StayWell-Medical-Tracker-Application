import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setupProfile } from '../redux/slices/authSlice';
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleProfileSetup = () => {
    const userData = {
      username,
      pronouns,
      phone,
      birthday,
      profilePhoto,
    };
    dispatch(setupProfile(userData));
    navigation.navigate('Dashboard');
  };

  const handleProfilePhotoUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri);
    }
  }; // Added the missing closing brace here

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Profile</Text>
      <TouchableOpacity style={styles.profilePhotoContainer} onPress={handleProfilePhotoUpload}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.profilePhotoPlaceholder}>
            <Text style={styles.profilePhotoPlaceholderText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <Input placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <Input placeholder="Pronouns" value={pronouns} onChangeText={setPronouns} style={styles.input} />
      <Input
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <Input
        placeholder="Birthday"
        value={birthday}
        onChangeText={setBirthday}
        style={styles.input}
      />
      <Button title="Complete Profile" onPress={handleProfileSetup} />
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
    marginBottom: 24,
    textAlign: 'center',
    color: '#45A6FF',
    fontFamily: 'Poppins-Bold',
  },
  profilePhotoContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profilePhotoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePhotoPlaceholderText: {
    fontSize: 16,
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
  input: {
    marginBottom: 16,
  },
});

export default ProfileSetupScreen;