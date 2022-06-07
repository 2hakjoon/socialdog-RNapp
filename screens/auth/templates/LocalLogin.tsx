import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {gql, useMutation} from '@apollo/client';
import {useForm} from 'react-hook-form';
import {regexEmail, regexPassword} from '../../../utils/regex';
import BasicButton from '../../components/BasicButton';
import {storeData} from '../../../utils/asyncStorage';
import {USER_ACCESS_TOKEN, USER_REFRESH_TOKEN} from '../../../utils/constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  AuthNavigationProp,
  AuthRouteProp,
  UseNavigationProp,
} from '../../../routes';
import FormInputBox from '../../components/Input/FormInputBox';
import {
  MLocalLogin,
  MLocalLoginVariables,
} from '../../../__generated__/MLocalLogin';
import {mVLoginState, mVUserAccessToken} from '../../../apollo-setup';
import {Alert} from 'react-native';

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

function LocalLogin() {
  const route = useRoute<AuthRouteProp<'Login'>>();
  const [login] = useMutation<MLocalLogin, MLocalLoginVariables>(LOGIN);
  const navigation = useNavigation<UseNavigationProp<'AuthTab'>>();
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
    if (res.data?.localLogin.error) {
      Alert.alert('로그인 실패', res.data?.localLogin.error);
    }
    if (res.data?.localLogin && res.data.localLogin.accessToken) {
      await saveTokens(res.data);
      mVLoginState(true);
      mVUserAccessToken(res.data.localLogin.accessToken);
    }
  };

  const moveToJoin = () => {
    navigation.push('Join');
  };

  useEffect(() => {
    if (route?.params?.email && route?.params?.password) {
      //console.log(route.params);
      setValue('email', route.params.email);
      setValue('password', route.params.password);
    }
  }, [route]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.formWrapper}>
        <FormInputBox
          titleColor={colors.PWhite}
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
          titleColor={colors.PWhite}
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
          fontColor={colors.PBlue}
          fontWeight={'600'}
          style={styles.buttonStyle}
        />
      </View>
      <View style={styles.joinButtonWrapper}>
        <BasicButton
          title="회원가입"
          onPress={moveToJoin}
          fontColor={colors.PBlue}
          fontWeight={'600'}
          style={styles.buttonStyle}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.PBlue,
    paddingHorizontal: '10%',
  },
  formWrapper: {
    flex: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    marginTop: 20,
    backgroundColor: colors.PWhite,
    color: colors.PBlue,
  },
  joinButtonWrapper: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.PBlue,
    justifyContent: 'flex-end',
    paddingBottom: '10%',
  },
});

export default LocalLogin;
