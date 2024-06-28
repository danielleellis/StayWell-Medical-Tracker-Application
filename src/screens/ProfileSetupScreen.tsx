import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setupProfile } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { colors, fonts } from "../constants/constants";
import axios from 'axios';
import configData from "../../config.json";
import { useSelector } from 'react-redux';

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const serverEndpoint = configData.API_ENDPOINT;

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

    if (!loaded) {
        return null;
    }

    // Get userID from Redux state
    const userID = useSelector((state: RootState) => state.auth.user);

    const handleProfileSetup = async () => {
        const userData = {
            username,
            pronouns,
            phone,
            birthday,
            profilePhoto,
        };

        try {
            const response = await axios.put(`${serverEndpoint}/profile-setup/${userID}`, userData);
            if (response.status === 200) {
                dispatch(setupProfile(userData));
                navigation.navigate('Dashboard');
                console.log('Profile setup successful. UserData:', userData);
            } else {
                console.error('Failed to update profile:', response.data);
            }
        } catch (error) {
            console.error('An error occurred during profile setup:', error);
        }
    };

  const handleProfilePhotoUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access the media library is required!");
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
    };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Profile</Text>
      <TouchableOpacity
        style={styles.profilePhotoContainer}
        onPress={handleProfilePhotoUpload}
      >
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.profilePhotoPlaceholder}>
            <Text style={styles.profilePhotoPlaceholderText}>Upload Photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <Input
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Input
        placeholder="Pronouns"
        value={pronouns}
        onChangeText={setPronouns}
        style={styles.input}
      />
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
      <Button title="Save" onPress={handleProfileSetup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  profilePhotoContainer: {
    alignSelf: "center",
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
    backgroundColor: colors.grey,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhotoPlaceholderText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.regular,
  },
  input: {
    marginBottom: 16,
  },
});

export default ProfileSetupScreen;
