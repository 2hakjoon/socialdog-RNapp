import React, {useEffect} from 'react';
import GoogleLogInBtn from './components/GoogleLogInBtn';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../module';
import {authorize} from '../../module/auth';
import {usersCollection} from '../../firebase';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';
import {gql, useMutation, useQuery} from '@apollo/client';
import {Controller, useForm} from 'react-hook-form';
import {regexEmail, regexPassword} from '../../utils/regex';
import BasicButton from '../components/BasicButton';
import TextComp from '../components/TextComp';

interface ILogInScreenProps {
  setUserData: Function;
}

interface ILoginForm {
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(args: {email: $email, password: $password}) {
      ok
      accessToken
      refreshToken
      error
    }
  }
`;

export function LogInScreen({setUserData}: ILogInScreenProps) {
  const [login, {loading, error, data}] = useMutation(LOGIN_MUTATION);
  const {register, handleSubmit, formState, control} = useForm<ILoginForm>({
    mode: 'onBlur',
  });

  const onSumbit = ({email, password}: ILoginForm) => {
    console.log(email, password, formState);
    login({
      variables: {email, password: password},
    });
  };

  useEffect(() => {
    console.log(data);
  }, [loading]);

  return (
    <View style={styles.wrapper}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: '이메일을 입력해주세요.',
          pattern: {
            value: regexEmail,
            message: '이메일 형식으로 입력해주세요.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {formState.errors.email?.message && (
        <TextComp text={formState.errors.email.message} />
      )}
      <Controller
        name="password"
        control={control}
        rules={{
          required: '비밀번호를 입력해주세요',
          pattern: {
            value: regexPassword,
            message:
              '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 입니다.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            maxLength={20}
            secureTextEntry={true}
          />
        )}
      />
      {formState.errors.password?.message && (
        <TextComp text={formState.errors.password.message} />
      )}

      <BasicButton title="로그인" onPress={handleSubmit(onSumbit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 2,
    borderColor: colors.PBlue,
    marginBottom: 10,
  },
});
