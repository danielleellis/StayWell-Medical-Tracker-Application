import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/constants';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'JosefinSans-Bold',
  },
  disabledButton: {
    backgroundColor: colors.lightblue,
  },
  disabledButtonText: {
    color: colors.blue,
  },
});

export default Button;