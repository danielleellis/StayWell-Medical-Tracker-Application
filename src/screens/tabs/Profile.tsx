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
import { RootState } from "../../redux/store";
import { signOut } from "../../redux/slices/authSlice";
import axios from "axios";
import configData from "../../../config.json";
import { colors, fonts } from "../../constants/constants";

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const userID = user?.userID;
    const [profileData, setProfileData] = useState<any>(null);
    const [fetchedImageUrl, setFetchedImageUrl] = useState<string | null>(null);
    const dispatch = useDispatch();
    const serverEndpoint = configData.API_ENDPOINT;

    const handleSignOut = () => {
        dispatch(signOut());
        navigation.navigate("SignIn");
    };

    const handleViewFriends = () => {
        navigation.navigate("Friends");
    };

    const handleSettings = () => {
        navigation.navigate("Settings");
    };

    // Fetch profile data and image when component mounts
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!userID) return;

            try {
                const response = await axios.get(`${serverEndpoint}/users/${userID}`);
                if (response.data.user) {
                    setProfileData(response.data.user); // Assuming `user` key exists
                } else {
                    setProfileData(response.data); // If no `user` key, use direct response
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                Alert.alert("Error", "Failed to load profile data.");
            }
        };

        const fetchProfileImage = async () => {
            if (!userID) return;

            try {
                const key = `${userID}`; // Use the correct key
                const response = await axios.get(`${serverEndpoint}/get-image`, {
                    params: { key },
                });

                if (response.data.url) {
                    setFetchedImageUrl(response.data.url);
                } else {
                    setFetchedImageUrl(null);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setFetchedImageUrl(null); // Default to placeholder if not found
                } else {
                    console.error("Error fetching image:", error);
                }
            }
        };

        fetchProfileData();
        fetchProfileImage();
    }, [userID]);

    // Render a loading state while fetching data
    if (!profileData) {
        return <Text style={{ fontFamily: fonts.regular }}>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.heading}>S T A Y W E L L</Text>

            <Image
                source={
                    fetchedImageUrl
                        ? { uri: fetchedImageUrl }
                        : require("../../../assets/images/Temp-Profile-Picture.png")
                }
                style={styles.profileImage}
                onError={() => setFetchedImageUrl(null)} // If there is an error loading, fallback to default
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
        paddingHorizontal: "5%",
        backgroundColor: colors.white,
        paddingTop: "10%",
    },
    heading: {
        fontSize: 30,
        color: colors.blue,
        marginTop: "5%",
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
        fontFamily: fonts.regular,
        textAlign: "center",
    },
    subText: {
        fontSize: 14,
        fontFamily: fonts.regular,
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
        fontFamily: fonts.regular,
    },
    infoText: {
        fontSize: 12,
        fontFamily: fonts.regular,
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
        fontFamily: fonts.regular,
        textDecorationLine: "underline",
    },
    signOutButton: {
        backgroundColor: colors.white,
        borderColor: "red",
    },
    signOutButtonText: {
        color: "red",
        fontFamily: fonts.regular,
    },
});
