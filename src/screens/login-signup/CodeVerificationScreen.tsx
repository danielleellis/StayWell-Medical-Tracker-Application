import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
} from "react-native";
import Button from "../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import axios from 'axios';
import configData from "../../../config.json";
import { colors, fonts } from "../../constants/constants";
import { useFocusEffect } from "@react-navigation/native";
const serverEndpoint = configData.API_ENDPOINT;

const CodeVerificationScreen: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const { from } = route.params; // to determine what code we're verifying

    const [code1, setCode1] = useState("");
    const [code2, setCode2] = useState("");
    const [code3, setCode3] = useState("");
    const [code4, setCode4] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const email = useSelector((state: RootState) => state.auth.user?.email);

    const code2Ref = useRef<TextInput>(null);
    const code3Ref = useRef<TextInput>(null);
    const code4Ref = useRef<TextInput>(null);

    // Inside CodeVerificationScreen component
    useFocusEffect(
        useCallback(() => {
            // Clear code fields whenever the screen is focused
            setCode1("");
            setCode2("");
            setCode3("");
            setCode4("");

            return () => {
                // Optionally, reset fields on blur if needed
                setCode1("");
                setCode2("");
                setCode3("");
                setCode4("");
            };
        }, [])
    );

    useEffect(() => {
        // Resend verification code when the component loads
        handleResendCode();

        // Intercept the back button press
        const unsubscribe = navigation.addListener('beforeRemove', (e:any) => {
            e.preventDefault();

            // Custom back navigation logic based on 'from'
            if (from === "signup" || from === "forgotPassword") {
                navigation.navigate("SignIn");
            } else if (from === "forgotPasscode") {
                navigation.navigate('Dashboard', {
                    screen: 'DocumentsHome', // The name of the tab
                    params: {
                        screen: 'Documents', // The screen within the DocumentNavigator
                    },
                });
            } else {
                navigation.goBack();
            }
        });

        return unsubscribe; // Cleanup on unmount
    }, [navigation, from]);

    const handleVerifyCode = async () => {
        const verificationCode = code1 + code2 + code3 + code4;
        try {
            const response = await axios.post(`${serverEndpoint}/check-verification-code`, {
                email,
                userVerificationCode: verificationCode,
            });

            if (response.status === 200) {
                if (from === "signup") {
                    navigation.navigate("Dashboard");
                } else if (from === "forgotPassword") {
                    navigation.navigate("ChangePassword");
                } else if (from === "forgotPasscode") {
                    navigation.navigate('Dashboard', {
                        screen: 'DocumentsHome', // The name of the tab
                        params: {
                            screen: 'ChangeDocumentPasscode', // The screen within the DocumentNavigator
                        },
                    });
                } else {
                    navigation.navigate("Calendar");
                }
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    // Incorrect code
                    Alert.alert(
                        "Verification Failed",
                        "Incorrect code entered, please try again."
                    );
                } else if (error.response?.status === 429) {
                    // Max attempts reached
                    Alert.alert(
                        "Max Attempts Reached",
                        "Please click 'Resend Verification Code' to request a new code."
                    );
                } else {
                    Alert.alert("Error", "An unexpected error occurred. Please try again.");
                }
            } else {
                Alert.alert("Error", "An unexpected error occurred. Please try again.");
            }
        }
    };


    const handleResendCode = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/verify-code/${email}`);
            if (response.status === 200) {
                alert(`A new verification code has been sent to ${email}.`);
            } else {
                alert("Failed to resend verification code. Please try again later.");
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                // Show a simple alert if the user has to wait
                Alert.alert(
                    "Wait Required",
                    "You have to wait 2 minutes between sending new verification codes."
                );
            } else {
                alert("Network error. Please try again.");
            }
        }
    };


  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/sun.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.description}>
        Please enter the code sent to: {email}
      </Text>
      <View style={styles.codeInputContainer}>
              <TextInput
                  key={`code1-${code1}`} // Make each key unique by adding an identifier
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code1}
                  onChangeText={(text) => {
                      setCode1(text);
                      if (text.length === 1) {
                          code2Ref.current?.focus();
                      }
                  }}
              />
              <TextInput
                  key={`code2-${code2}`} // Unique key for each input
                  ref={code2Ref}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code2}
                  onChangeText={(text) => {
                      setCode2(text);
                      if (text.length === 1) {
                          code3Ref.current?.focus();
                      }
                  }}
              />
              <TextInput
                  key={`code3-${code3}`} // Unique key for each input
                  ref={code3Ref}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code3}
                  onChangeText={(text) => {
                      setCode3(text);
                      if (text.length === 1) {
                          code4Ref.current?.focus();
                      }
                  }}
              />
              <TextInput
                  key={`code4-${code4}`} // Unique key for each input
                  ref={code4Ref}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={code4}
                  onChangeText={setCode4}
              />


      </View>
      <Button
        title="Next"
              onPress={handleVerifyCode}
        disabled={!code1 || !code2 || !code3 || !code4}
      />
      <TouchableOpacity onPress={handleResendCode}>
        <Text style={styles.resendCodeText}>Resend Verification Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 50,
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
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    width: 60,
    height: 60,
    fontSize: 24,
    textAlign: "center",
    fontFamily: fonts.regular,
  },
  resendCodeText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.blue,
    fontFamily: fonts.regular,
  },
});

export default CodeVerificationScreen;
