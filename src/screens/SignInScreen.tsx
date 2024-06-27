import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { signIn } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import { colors, fonts } from "../constants/constants";

const SignInScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleSignIn = () => {
    dispatch(signIn({ email, password }));
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/sun.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Sign In</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button
        title="Sign In"
        onPress={handleSignIn}
        disabled={!email || !password}
      />
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
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
  title: {
    fontSize: 24,
    marginBottom: 24,
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
  input: {
    marginBottom: 16,
  },
  forgotPasswordText: {
    marginBottom: 16,
    textAlign: "right",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  signUpText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});

export default SignInScreen;
