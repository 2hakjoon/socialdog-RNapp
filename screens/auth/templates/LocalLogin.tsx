import React, {useEffect} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {gql, useMutation} from '@apollo/client';
import {Controller, useForm} from 'react-hook-form';
import {regexEmail, regexPassword} from '../../../utils/regex';
import BasicButton from '../../components/BasicButton';
import TextComp from '../../components/TextComp';
import {
  LOGIN_MUTATION,
  LOGIN_MUTATIONVariables,
} from '../../../__generated__/LOGIN_MUTATION';
import {storeData} from '../../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../../utils/constants';
import {useRoute} from '@react-navigation/native';
import {AuthRoutProp} from '../../../routes';

interface ILogInScreenProps {
  setAccessToken: Function;
}

interface ILoginForm {
  email: string;
  password: string;
}

const LOGIN = gql`
  mutation LOGIN_MUTATION($email: String!, $password: String!) {
    login(args: {email: $email, password: $password}) {
      ok
      accessToken
      refreshToken
      error
    }
  }
`;

function LocalLogin({setAccessToken}: ILogInScreenProps) {
  const route = useRoute<AuthRoutProp<'Login'>>();
  const [login] = useMutation<LOGIN_MUTATION, LOGIN_MUTATIONVariables>(LOGIN);
  const {handleSubmit, setValue, formState, control} = useForm<ILoginForm>({
    mode: 'onBlur',
  });

  const saveTokens = async ({login}: LOGIN_MUTATION) => {
    if (login.accessToken && login.refreshToken) {
      await storeData({key: USER_ACCESS_TOKEN, value: login.accessToken});
      await storeData({key: USER_REFRESH_TOKEN, value: login.refreshToken});
    }
  };

  const onSumbit = async ({email, password}: ILoginForm) => {
    const {data} = await login({
      variables: {email, password: password},
    });
    if (data?.login.ok && data.login.accessToken) {
      await saveTokens(data);
      setAccessToken(data.login.accessToken);
    }
  };

  useEffect(() => {
    if (route?.params?.email && route?.params?.password) {
      console.log(route.params);
      setValue('email', route.params.email);
      setValue('password', route.params.password);
    }
  }, [route]);

  useEffect(() => {
    setValue('email', '2hakjoon@gmail.com');
    setValue('password', 'test1234!');
  }, []);

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
            autoCapitalize="none"
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

export default LocalLogin;
