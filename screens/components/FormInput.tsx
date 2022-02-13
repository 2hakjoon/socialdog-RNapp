import React from 'react';
import {StyleSheet, TextInput, TextInputProps, TextStyle} from 'react-native';
import {colors} from '../../utils/colors';

interface IFormInput extends TextInputProps {
  style?: TextStyle | undefined;
}

function FormInput({
  editable = true,
  onBlur,
  onChangeText,
  value,
  autoCapitalize,
  maxLength,
  secureTextEntry,
  style = {},
}: IFormInput) {
  return (
    <TextInput
      editable={editable}
      style={{
        ...styles.default,
        ...(!editable && styles.disable),
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
  },
  disable: {
    borderColor: colors.PLightGray,
    backgroundColor: colors.PLightGray,
  },
});

export default FormInput;
