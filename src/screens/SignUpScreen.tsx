import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import Input from "../components/Input";
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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const [loaded] = useFonts({
    "JosefinSans-Regular": require("../../assets/fonts/JosefinSans/JosefinSans-Regular.ttf"),
    "JosefinSans-Bold": require("../../assets/fonts/JosefinSans/JosefinSans-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let newErrors: {[key: string]: string} = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    if (password !== passwordConfirmed) newErrors.password = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setHasAttemptedSubmit(true);
    if (validateForm()) {
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };
      dispatch(signUp(userData));
      navigation.navigate("EmailVerification");
    }
  };

  const isFormFilled = () => {
    return firstName !== "" && lastName !== "" && email !== "" && password !== "" && passwordConfirmed !== "";
  };

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        autoCapitalize="words"
        style={styles.input}
      />
      {hasAttemptedSubmit && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
      <Input
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
        style={styles.input}
      />
      {hasAttemptedSubmit && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      {hasAttemptedSubmit && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={isPasswordHidden}
        autoCorrect={false}
        textContentType="oneTimeCode"
        style={styles.input}
        isPassword={true}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      <Input
        placeholder="Confirm Password"
        value={passwordConfirmed}
        onChangeText={setConfirmedPassword}
        secureTextEntry={isPasswordHidden}
        autoCorrect={false}
        textContentType="oneTimeCode"
        style={styles.input}
        isPassword={true}
        togglePasswordVisibility={togglePasswordVisibility}
      />
      {hasAttemptedSubmit && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <Button title="Next" onPress={handleNext} disabled={!isFormFilled()} />
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  },
  signInText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    fontFamily: fonts.regular,
  },
});

export default SignUpScreen;