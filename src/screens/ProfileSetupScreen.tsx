import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setupProfile } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { colors, fonts } from "../constants/constants";

const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleProfileSetup = () => {
    if (validateForm()) {
      const userData = {
        username,
        pronouns,
        phone,
        birthday,
        profilePhoto,
      };
      dispatch(setupProfile(userData));
      navigation.navigate("Dashboard");
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

  const formatPhoneNumber = (input: string) => {
    const cleanedInput = input.replace(/\D/g, "");
    let formattedInput = cleanedInput;
    if (cleanedInput.length > 3) {
      formattedInput = `(${cleanedInput.slice(0, 3)})`;
      if (cleanedInput.length > 6) {
        formattedInput += `-${cleanedInput.slice(3, 6)}-${cleanedInput.slice(
          6,
          10
        )}`;
      } else {
        formattedInput += `-${cleanedInput.slice(3)}`;
      }
    }
    return formattedInput;
  };

  const formatBirthday = (input: string) => {
    const cleanedInput = input.replace(/\D/g, "");
    let formattedInput = cleanedInput;
    if (cleanedInput.length > 2) {
      formattedInput = `${cleanedInput.slice(0, 2)}/`;
      if (cleanedInput.length > 4) {
        formattedInput += `${cleanedInput.slice(2, 4)}/${cleanedInput.slice(
          4,
          8
        )}`;
      } else {
        formattedInput += cleanedInput.slice(2);
      }
    }
    return formattedInput;
  };

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      newErrors.username = "Username must contain only letters and numbers";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }
    if (phone.replace(/\D/g, "").length !== 10)
      newErrors.phone = "Please enter a valid 10-digit phone number";
    if (birthday.length !== 10)
      newErrors.birthday = "Please enter a valid date in MM/DD/YYYY format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}
      <Input
        placeholder="Pronouns"
        value={pronouns}
        onChangeText={setPronouns}
        style={styles.input}
      />
      <Input
        placeholder="Phone (xxx)-xxx-xxxx"
        value={phone}
        onChangeText={(text) => setPhone(formatPhoneNumber(text))}
        keyboardType="phone-pad"
        style={styles.input}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      <Input
        placeholder="Birthday MM/DD/YYYY"
        value={birthday}
        onChangeText={(text) => setBirthday(formatBirthday(text))}
        keyboardType="numeric"
        style={styles.input}
      />
      {errors.birthday && (
        <Text style={styles.errorText}>{errors.birthday}</Text>
      )}
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
});

export default ProfileSetupScreen;
