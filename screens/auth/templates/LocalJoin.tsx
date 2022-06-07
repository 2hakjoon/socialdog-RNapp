import React, {useEffect, useState} from 'react';
import {colors} from '../../../utils/colors';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import {regexEmail, regexPassword, regexVerifyCode} from '../../../utils/regex';
import {Alert, StyleSheet, TextInput, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import BasicButton from '../../components/BasicButton';
import {useNavigation} from '@react-navigation/native';
import {AuthNavigationProp} from '../../../routes';
import FormInputBox from '../../components/Input/FormInputBox';
import FormBtnInputBox from '../../components/Input/FormBtnInputBox';
import {
  MCreateLocalAccount,
  MCreateLocalAccountVariables,
} from '../../../__generated__/MCreateLocalAccount';
import {
  MCreateVerification,
  MCreateVerificationVariables,
} from '../../../__generated__/MCreateVerification';
import {
  MVerifyEmailAndCode,
  MVerifyEmailAndCodeVariables,
} from '../../../__generated__/MVerifyEmailAndCode';

interface IJoinForm {
  email: string;
  password1: string;
  password2: string;
  code: string;
}

const JOIN = gql`
  mutation MCreateLocalAccount(
    $email: String!
    $password: String!
    $code: String!
  ) {
    createLocalAccount(
      args: {email: $email, password: $password, code: $code}
    ) {
      ok
      error
    }
  }
`;

const CREATE_VERIFICATION = gql`
  mutation MCreateVerification($email: String!) {
    createVerification(args: {email: $email}) {
      ok
      error
    }
  }
`;

const CHECK_VERIFICATION = gql`
  query MVerifyEmailAndCode($email: String!, $code: String!) {
    verifyEmailAndCode(args: {email: $email, code: $code}) {
      ok
      error
    }
  }
`;

function LocalJoin() {
  const navigation = useNavigation<AuthNavigationProp>();
  const [enableVerify, setEnableVerify] = useState(false);
  const [enableEmail, setEnableEmail] = useState(true);
  const [verifyDone, setVerifyDone] = useState(false);
  const [paswordError, setPasswordError] = useState(false);
  const [createAccount, {loading, error, data}] = useMutation<
    MCreateLocalAccount,
    MCreateLocalAccountVariables
  >(JOIN);

  const [createVerification, {}] = useMutation<
    MCreateVerification,
    MCreateVerificationVariables
  >(CREATE_VERIFICATION);

  const [verifyEmailandCode] = useLazyQuery<
    MVerifyEmailAndCode,
    MVerifyEmailAndCodeVariables
  >(CHECK_VERIFICATION);

  const {
    handleSubmit,
    getValues,
    watch,
    trigger,
    setValue,
    formState,
    control,
  } = useForm<IJoinForm>({
    mode: 'onChange',
  });

  const sendVerifyCode = async () => {
    const result = await createVerification({
      variables: {email: getValues('email')},
    });
    if (result.data?.createVerification.ok) {
      setEnableVerify(true);
      setEnableEmail(false);
      Alert.alert(
        '이메일 발송 안료.',
        '메일이 도착하지 않으셨다면, 스팸 메일함을 확인해보세요.',
      );
    } else {
      Alert.alert(
        '이메일 발송 실패',
        `${result.data?.createVerification.error}`,
      );
    }
  };

  const checkVerifyCode = async () => {
    const result = await verifyEmailandCode({
      variables: {email: getValues('email'), code: getValues('code')},
    });
    if (result.data?.verifyEmailAndCode.ok) {
      setEnableVerify(false);
      setVerifyDone(true);
      Alert.alert('인증 완료.', '인증이 완료되었습니다.');
    } else {
      console.log(result.error);
      console.log(result.data?.verifyEmailAndCode.error);
    }
  };

  const onSumbit = async ({email, password1, code}: IJoinForm) => {
    if (email && password1 && code) {
      const result = await createAccount({
        variables: {email: email, password: password1, code},
      });
      if (result.data?.createLocalAccount.ok) {
        await Alert.alert('회원가입완료', '가입이 완료되었습니다.', [
          {
            text: '로그인 하러가기',
            onPress: () => {
              navigation.replace('Login', {email, password: password1});
            },
          },
        ]);
      } else {
        console.log(result.errors);
        Alert.alert(
          '회원가입 오류',
          result?.data?.createLocalAccount?.error || '회원가입에 실패했습니다.',
        );
      }
    }
  };

  useEffect(() => {
    // setValue('email', 'dlgkrwns1021@naver.com');
    // setValue('password1', 'test1234!');
    // setValue('password2', 'test1234!');
    // setValue('code', '491012');
  }, []);

  return (
    <View style={styles.wrapper}>
      <FormBtnInputBox
        input={{
          title: '이메일',
          control,
          errors: formState.errors.email?.message,
          name: 'email',
          rules: {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: regexEmail,
              message: '이메일 형식으로 입력해주세요.',
            },
          },
          editable: enableEmail && !verifyDone,
        }}
        button={{
          disabled:
            Boolean(formState?.errors?.email?.message) ||
            !getValues('email') ||
            verifyDone,
          title: '이메일 인증',
          onPress: sendVerifyCode,
        }}
      />

      <FormBtnInputBox
        input={{
          title: '인증번호',
          control,
          errors: formState.errors.code?.message,
          name: 'code',
          rules: {
            pattern: {
              value: regexVerifyCode,
              message: '인증코드는 6자리입니다.',
            },
          },
          editable: enableVerify && !verifyDone,
        }}
        button={{
          disabled:
            (!enableVerify &&
              (Boolean(formState?.errors?.code?.message) ||
                !getValues('code'))) ||
            verifyDone,
          title: '번호 확인',
          onPress: checkVerifyCode,
        }}
      />

      <FormInputBox
        title={'바말번호'}
        control={control}
        rules={{
          required: '비밀번호를 입력해주세요',
          pattern: {
            value: regexPassword,
            message:
              '비밀번호는 최소 8자, 하나 이상의 문자, 하나의 숫자 입니다.',
          },
          validate: async () => {
            trigger('password2');
            return undefined;
          },
        }}
        name="password1"
        maxLength={20}
        secureTextEntry={true}
        errors={formState.errors.password1?.message}
      />
      <FormInputBox
        title={'바말번호 확인'}
        control={control}
        rules={{
          required: '비밀번호를 입력해주세요',
          validate: value => {
            setPasswordError(watch('password1') !== value);
            return undefined;
          },
        }}
        name="password2"
        maxLength={20}
        secureTextEntry={true}
        errors={
          paswordError && Boolean(getValues('password2'))
            ? '비밀번호가 일치하지 않습니다.'
            : formState.errors.password2?.message
        }
      />
      <BasicButton
        style={styles.btnWrapper}
        disable={
          !(
            Boolean(getValues('email')) &&
            Boolean(getValues('password1')) &&
            Boolean(getValues('password2')) &&
            Boolean(getValues('code')) &&
            !paswordError
          )
        }
        title="회원가입"
        onPress={handleSubmit(onSumbit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: '10%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBox: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  InputBox: {
    width: '100%',
    marginBottom: 15,
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
});

export default LocalJoin;
