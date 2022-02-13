import React from 'react';
import {StyleSheet, TextInputProps, View} from 'react-native';
import {Controller, RegisterOptions} from 'react-hook-form';
import TextComp from '../../components/TextComp';
import FormInput from '../../components/FormInput';

interface IFormInputComp extends TextInputProps {
  title: string;
  name: string;
  control: any;
  rules: RegisterOptions;
  errors: string | undefined;
  button?: {
    title: string;
    onPress: () => {};
  };
}

function FormInputBox({
  title,
  name,
  control,
  rules,
  errors = '',
  secureTextEntry,
  maxLength,
}: IFormInputComp) {
  return (
    <View style={styles.InputBox}>
      <TextComp text={title} style={styles.sectionTitle} />
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
            error={Boolean(errors)}
          />
        )}
      />
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
  btnWrapper: {
    marginTop: 40,
  },
  errorText: {
    marginLeft: 5,
    marginTop: 5,
  },
});

export default FormInputBox;
