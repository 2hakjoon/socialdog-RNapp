import React from 'react';
import {ButtonProps, StyleSheet, TextInputProps, View} from 'react-native';
import {Controller} from 'react-hook-form';
import TextComp from '../TextComp';
import FormInput from './FormInput';
import SmallButton from '../SmallButton';

interface IFormInputComp extends TextInputProps {
  title: string;
  name: string;
  control: any;
  rules: any;
  errors: string | undefined;
}
interface IFormButtonComp extends ButtonProps {}

interface IFormBtnInputBox {
  input: IFormInputComp;
  button: IFormButtonComp;
}

function FormBtnInputBox({
  input: {
    title: inputTitle,
    name,
    control,
    rules,
    errors = '',
    secureTextEntry,
    maxLength,
    editable,
  },
  button: {title: btnTitle, onPress, disabled},
}: IFormBtnInputBox) {
  return (
    <View style={styles.InputBox}>
      <TextComp text={inputTitle} style={styles.sectionTitle} />
      <View style={styles.rowBox}>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              editable={editable}
              style={styles.shortInput}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={maxLength}
              secureTextEntry={secureTextEntry}
              error={Boolean(errors)}
            />
          )}
        />
        <SmallButton disabled={disabled} title={btnTitle} onPress={onPress} />
      </View>
      <TextComp text={errors} style={styles.errorText} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  InputBox: {
    width: '100%',
    marginBottom: 10,
  },
  rowBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginBottom: 8,
  },
  shortInput: {
    width: '65%',
  },
  smallBtn: {
    width: '30%',
  },
  errorText: {
    marginLeft: 5,
    marginTop: 5,
  },
});

export default FormBtnInputBox;
