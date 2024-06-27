import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { signUp } from "../redux/slices/authSlice";
import { useFonts } from "expo-font";
import { colors, fonts } from "../constants/constants";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmed, setConfirmedPassword] = useState("");
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
    if (password !== passwordConfirmed) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

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
      password === passwordConfirmed
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
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordHidden}
          autoCorrect={false}
          textContentType={"oneTimeCode"}
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Image
            source={isPasswordHidden ? require('../../assets/images/eye-off.png') : require('../../assets/images/eye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={passwordConfirmed}
          onChangeText={setConfirmedPassword}
          secureTextEntry={isPasswordHidden}
          autoCorrect={false}
          textContentType={"oneTimeCode"}
          style={[styles.input, styles.passwordInput]}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Image
            source={isPasswordHidden ? require('../../assets/images/eye-off.png') : require('../../assets/images/eye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
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
    backgroundColor: colors.white,
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
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  input: {
    marginBottom: 16,
    height: 40,
    borderColor: colors.grey,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.regular,
    borderRadius: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  signInText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});

export default SignUpScreen;