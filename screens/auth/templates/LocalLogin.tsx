import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {gql, useMutation} from '@apollo/client';
import {useForm} from 'react-hook-form';
import {regexEmail, regexPassword} from '../../../utils/regex';
import BasicButton from '../../components/BasicButton';
import {storeData} from '../../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../../utils/constants';
import {useRoute} from '@react-navigation/native';
import {AuthRoutProp} from '../../../routes';
import FormInputBox from '../../components/Input/FormInputBox';
import {
  MLocalLogin,
  MLocalLoginVariables,
} from '../../../__generated__/MLocalLogin';

interface ILogInScreenProps {
  setAccessToken: Function;
}

interface ILoginForm {
  email: string;
  password: string;
}

const LOGIN = gql`
  mutation MLocalLogin($email: String!, $password: String!) {
    localLogin(args: {email: $email, password: $password}) {
      ok
      accessToken
      refreshToken
      error
    }
  }
`;

function LocalLogin({setAccessToken}: ILogInScreenProps) {
  const route = useRoute<AuthRoutProp<'Login'>>();
  const [login] = useMutation<MLocalLogin, MLocalLoginVariables>(LOGIN);
  const {handleSubmit, setValue, formState, control} = useForm<ILoginForm>({
    mode: 'onBlur',
  });

  const saveTokens = async ({localLogin}: MLocalLogin) => {
    if (localLogin.accessToken && localLogin.refreshToken) {
      await storeData({key: USER_ACCESS_TOKEN, value: localLogin.accessToken});
      await storeData({
        key: USER_REFRESH_TOKEN,
        value: localLogin.refreshToken,
      });
    }
  };

  const onSumbit = async ({email, password}: ILoginForm) => {
    const res = await login({
      variables: {email, password},
    });
    if (res.data?.localLogin && res.data.localLogin.accessToken) {
      await saveTokens(res.data);
      setAccessToken(res.data.localLogin.accessToken);
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
      <FormInputBox
        title={'이메일'}
        name={'email'}
        control={control}
        rules={{
          required: '이메일을 입력해주세요.',
          pattern: {
            value: regexEmail,
            message: '이메일 형식으로 입력해주세요.',
          },
        }}
        errors={formState.errors.email?.message}
      />
      <FormInputBox
        title={'비밀번호'}
        name={'password'}
        control={control}
        rules={{
          required: '비밀번호를 입력해주세요',
          pattern: {
            value: regexPassword,
            message:
              '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 입니다.',
          },
        }}
        secureTextEntry
        errors={formState.errors.password?.message}
      />
      <BasicButton
        title="로그인"
        onPress={handleSubmit(onSumbit)}
        style={styles.buttonStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    paddingHorizontal: '10%',
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
  buttonStyle: {
    marginTop: 20,
  },
});

export default LocalLogin;
