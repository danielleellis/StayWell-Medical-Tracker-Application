import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { forgotPassword } from "../../redux/slices/authSlice";
import { useFonts } from "expo-font";
import { colors, fonts } from "../../constants/constants";

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation, }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleForgotPassword = () => {
    // Dispatch the email to Redux
    dispatch(forgotPassword(email));
    navigation.navigate("CodeVerification", { from: "forgotPassword" });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("SignIn")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>
      <Image
        source={require("../../../assets/images/sun.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you a code to reset your
        password.
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Button
        title="Send Reset Code"
        onPress={handleForgotPassword}
        disabled={!email}
      />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.backToSignInText}>Back to Sign In</Text>
      </TouchableOpacity>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  logo: {
    width: 240,
    height: 75,
    alignSelf: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
    fontFamily: fonts.regular,
  },
  input: {
    marginBottom: 16,
  },
  backToSignInText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});

export default ForgotPasswordScreen;
