import React from 'react';
import {StyleSheet, TextInput, TextInputProps, TextStyle} from 'react-native';
import {colors} from '../../../utils/colors';

interface IFormInput extends TextInputProps {
  style?: TextStyle | undefined;
  error?: boolean;
}

function FormInput({
  editable = true,
  onBlur,
  onChangeText,
  value,
  autoCapitalize = 'none',
  maxLength,
  secureTextEntry,
  style = {},
  error,
}: IFormInput) {
  return (
    <TextInput
      editable={editable}
      style={{
        ...styles.default,
        ...(!editable && styles.disable),
        ...(error && styles.error),
        ...style,
      }}
      onBlur={onBlur}
      onChangeText={onChangeText}
      value={value}
      autoCapitalize={autoCapitalize}
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    alignSelf: 'stretch',
    height: 40,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.PLightGray,
    paddingLeft: 10,
    backgroundColor: colors.PWhite,
  },
  disable: {
    borderColor: colors.PLightGray,
    backgroundColor: colors.PLightGray,
  },
  error: {
    borderColor: 'red',
  },
});

export default FormInput;
