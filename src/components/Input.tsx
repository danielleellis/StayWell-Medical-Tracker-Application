import React from 'react';
import { TextInput, View, StyleSheet, TextStyle, ViewStyle, TouchableOpacity, Image } from 'react-native';

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: ViewStyle | TextStyle;
  isPassword?: boolean;
  togglePasswordVisibility?: () => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  isPassword = false,
  togglePasswordVisibility,
  autoCapitalize = 'none',
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {isPassword && (
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Image
            source={secureTextEntry ? require('../../assets/images/eye-off.png') : require('../../assets/images/eye.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: 'JosefinSans-Regular',
  },
  eyeIcon: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default Input;