import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
  });

  const handleGetStarted = () => {
    navigation.navigate("SignUp"); // Navigate to SignUp screen
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.tagline}>
          PUTTING THE
          {"\n"}
          SELF-CARE in HEALTHCARE
        </Text>
      </View>
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 350,
    height: 350,
  },
  tagline: {
    marginTop: -80,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "JosefinSans-Regular",
    color: "#B1DAB6",
  },
  getStartedButton: {
    backgroundColor: "#45A6FF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "JosefinSans-Regular",
  },
});

export default SplashScreen;
