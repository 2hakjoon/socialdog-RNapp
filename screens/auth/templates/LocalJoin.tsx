import React, {useEffect, useState} from 'react';
import {colors} from '../../../utils/colors';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import {regexEmail, regexPassword, regexVerifyCode} from '../../../utils/regex';
import {Alert, StyleSheet, TextInput, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {
  M_CREATE_ACCOUNT,
  M_CREATE_ACCOUNTVariables,
} from '../../../__generated__/M_CREATE_ACCOUNT';
import TextComp from '../../components/TextComp';
import BasicButton from '../../components/BasicButton';
import {
  M_CREATE_VERIFICATON,
  M_CREATE_VERIFICATONVariables,
} from '../../../__generated__/M_CREATE_VERIFICATON';
import {
  Q_CHECK_VERIFICATION,
  Q_CHECK_VERIFICATIONVariables,
} from '../../../__generated__/Q_CHECK_VERIFICATION';
import SmallButton from '../../components/SmallButton';
import {useNavigation} from '@react-navigation/native';
import {AuthNavigationProp} from '../../../routes';
import FormInput from '../../components/FormInput';
import FormInputBox from '../components/FormInputBox';

interface IJoinForm {
  email: string;
  password1: string;
  password2: string;
  code: string;
  username: string;
}

const JOIN = gql`
  mutation M_CREATE_ACCOUNT(
    $email: String!
    $password: String!
    $username: String!
    $code: String!
  ) {
    createAccount(
      args: {
        email: $email
        password: $password
        username: $username
        code: $code
      }
    ) {
      ok
      error
    }
  }
`;

const CREATE_VERIFICATION = gql`
  mutation M_CREATE_VERIFICATON($email: String!) {
    createVerification(args: {email: $email}) {
      ok
      error
    }
  }
`;

const CHECK_VERIFICATION = gql`
  query Q_CHECK_VERIFICATION($email: String!, $code: String!) {
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
    M_CREATE_ACCOUNT,
    M_CREATE_ACCOUNTVariables
  >(JOIN);

  const [createVerification, {}] = useMutation<
    M_CREATE_VERIFICATON,
    M_CREATE_VERIFICATONVariables
  >(CREATE_VERIFICATION);

  const [verifyEmailandCode] = useLazyQuery<
    Q_CHECK_VERIFICATION,
    Q_CHECK_VERIFICATIONVariables
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

  const onSumbit = async ({email, password1, code, username}: IJoinForm) => {
    if (email && password1 && code && username) {
      const result = await createAccount({
        variables: {email: email, password: password1, code, username},
      });
      if (result.data?.createAccount.ok) {
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
          result?.data?.createAccount?.error || '회원가입에 실패했습니다.',
        );
      }
    }
  };

  useEffect(() => {
    setValue('email', 'dlgkrwns1021@naver.com');
    setValue('password1', 'test1234!');
    setValue('password2', 'test1234!');
    setValue('code', '491012');
    setValue('username', '이학준');
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.InputBox}>
        <TextComp text={'이메일'} size={14} style={styles.sectionTitle} />
        <View style={styles.rowBox}>
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
              <FormInput
                editable={enableEmail && !verifyDone}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize={'none'}
                style={styles.shortInput}
              />
            )}
          />
          <SmallButton
            style={styles.smallBtn}
            disable={
              Boolean(formState?.errors?.email?.message) ||
              !Boolean(getValues('email')) ||
              verifyDone
            }
            title="이메일 인증"
            onPress={sendVerifyCode}
          />
        </View>
        {formState.errors.email?.message && (
          <TextComp text={formState.errors.email.message} />
        )}
      </View>
      <View style={styles.InputBox}>
        <TextComp text={'인증번호'} size={14} style={styles.sectionTitle} />
        <View style={styles.rowBox}>
          <Controller
            name="code"
            control={control}
            rules={{
              pattern: {
                value: regexVerifyCode,
                message: '인증코드는 6자리입니다.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                editable={enableVerify && !verifyDone}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.shortInput}
              />
            )}
          />
          <SmallButton
            style={styles.smallBtn}
            disable={
              (!enableVerify &&
                (Boolean(formState?.errors?.code?.message) ||
                  !Boolean(getValues('code')))) ||
              verifyDone
            }
            title="번호 확인"
            onPress={checkVerifyCode}
          />
        </View>
        {formState.errors.code?.message && (
          <TextComp text={formState.errors.code.message} />
        )}
      </View>
      <View style={styles.InputBox}>
        <TextComp text={'비밀번호'} size={14} style={styles.sectionTitle} />
        <Controller
          name="password1"
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
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={20}
              secureTextEntry={true}
            />
          )}
        />
        {formState.errors.password1?.message && (
          <TextComp text={formState.errors.password1.message} />
        )}
      </View>
      <View style={styles.InputBox}>
        <TextComp
          text={'비밀번호 확인'}
          size={14}
          style={styles.sectionTitle}
        />
        <Controller
          name="password2"
          control={control}
          rules={{
            required: '비밀번호를 입력해주세요',
            validate: value => {
              setPasswordError(watch('password1') !== value);
              return undefined;
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={20}
              secureTextEntry={true}
            />
          )}
        />
        {paswordError && Boolean(getValues('password2')) && (
          <TextComp text={'비밀번호가 일치하지 않습니다.'} />
        )}
        {formState.errors.password2?.message && (
          <TextComp text={formState.errors.password2.message} />
        )}
      </View>
      <View style={styles.InputBox}>
        <TextComp text={'사용자 이름'} size={14} style={styles.sectionTitle} />
        <Controller
          name="username"
          control={control}
          rules={{
            required: '사용자 이름을 입력해주세요',
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              maxLength={20}
            />
          )}
        />
      </View>
      <BasicButton
        style={styles.btnWrapper}
        disable={
          !(
            Boolean(getValues('email')) &&
            Boolean(getValues('password1')) &&
            Boolean(getValues('password2')) &&
            Boolean(getValues('username')) &&
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
