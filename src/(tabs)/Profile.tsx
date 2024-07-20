import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { signOut } from "../redux/slices/authSlice";
import axios from "axios";
import configData from "../../config.json";
import { colors, fonts } from "../constants/constants";

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [profileData, setProfileData] = useState<any>(null);
  const dispatch = useDispatch();
  const serverEndpoint = configData.API_ENDPOINT;

  const handleSignOut = () => {
    // Clear user state in Redux then redirect to login screen
    dispatch(signOut());
    navigation.navigate("SignIn");
  };

  const handleViewFriends = () => {
    navigation.navigate("Friends");
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.userID) {
        return;
      }

      try {
        const response = await axios.get(
          `${serverEndpoint}/users/${user.userID}`
        );
        if (response.status === 200 && response.data.user) {
          setProfileData(response.data.user);
        } else {
          console.error("User not found: ", response.data);
          Alert.alert("Error", "Failed to load profile data.");
        }
      } catch (error) {
        console.error("An error occurred while fetching profile data:", error);
        Alert.alert(
          "Network Error",
          "An error occurred while fetching profile data."
        );
      }
    };

    fetchProfileData();
  }, [user]);

  if (!profileData) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>S T A Y W E L L</Text>

      <Image
        source={require("../../assets/images/Temp-Profile-Picture.png")}
        style={styles.profileImage}
      />

      <Text style={styles.username}>{profileData.username}</Text>
      <Text style={styles.subText}>{profileData.pronouns}</Text>
      <Text style={styles.subText}>
        {profileData.firstName} {profileData.lastName}
      </Text>

      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.infoLabel}>Birthday:</Text>
          <Text style={styles.infoLabel}>Email Address:</Text>
          <Text style={styles.infoLabel}>Phone Number:</Text>
        </View>
        <View>
          <Text style={styles.infoText}>{profileData.birthday}</Text>
          <Text style={styles.infoText}>{profileData.email}</Text>
          <Text style={styles.infoText}>{profileData.phoneNumber}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleViewFriends}>
        <Text style={styles.buttonText}>View Friends List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSettings}>
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={[styles.buttonText, styles.signOutButtonText]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingTop: 50,
  },
  heading: {
    fontSize: 30,
    color: colors.blue,
    marginTop: 20,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginTop: 16,
  },
  username: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 12,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
  signOutButton: {
    backgroundColor: colors.white,
    borderColor: "red",
  },
  signOutButtonText: {
    color: "red",
  },
});
