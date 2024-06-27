import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { signUp } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, confirmPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const handleNext = () => {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword: passwordConfirmed,
    };
    dispatch(signUp(userData));
    navigation.navigate("EmailVerification");
  };

  const isFormValid = () => {
    return (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== "" &&
      passwordConfirmed !== ""
    );
  };

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Splash")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>{"BACK"}</Text>
      </TouchableOpacity>
      <Image
        source={require("../../assets/images/sun.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create an Account</Text>
      <Input
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
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
        secureTextEntry={isPasswordHidden}
        style={styles.input}
        isPassword={true}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <Input
        placeholder="Confirm Password"
        value={passwordConfirmed}
        onChangeText={confirmPassword}
        secureTextEntry={isPasswordHidden}
        style={styles.input}
        isPassword={true}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <Button title="Next" onPress={handleNext} disabled={!isFormValid()} />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 240,
    height: 75,
    alignSelf: "center",
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#6BB7ED",
    fontFamily: "JosefinSans-Regular",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: "#6BB7ED",
    fontFamily: "JosefinSans-Regular",
  },
  input: {
    marginBottom: 16,
  },
  signInText: {
    marginTop: 16,
    textAlign: "center",
    color: "#6BB7ED",
    fontFamily: "JosefinSans-Regular",
  },
});

export default SignUpScreen;