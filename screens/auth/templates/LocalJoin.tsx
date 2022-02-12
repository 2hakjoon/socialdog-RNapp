import React, {useEffect} from 'react';
import {colors} from '../../../utils/colors';
import {gql, useMutation} from '@apollo/client';
import {regexEmail, regexPassword} from '../../../utils/regex';
import {StyleSheet, TextInput, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {M_CREATE_ACCOUNT} from '../../../__generated__/M_CREATE_ACCOUNT';
import {M_CREATE_WALKVariables} from '../../../__generated__/M_CREATE_WALK';
import TextComp from '../../components/TextComp';
import BasicButton from '../../components/BasicButton';
import {
  M_CREATE_VERIFICATON,
  M_CREATE_VERIFICATONVariables,
} from '../../../__generated__/M_CREATE_VERIFICATON';

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

function LocalJoin() {
  const saveTokens = async ({createAccount}: M_CREATE_ACCOUNT) => {};

  const [createAccount, {loading, error, data}] = useMutation<
    M_CREATE_ACCOUNT,
    M_CREATE_WALKVariables
  >(JOIN);

  const [createVerification, {}] = useMutation<
    M_CREATE_VERIFICATON,
    M_CREATE_VERIFICATONVariables
  >(CREATE_VERIFICATION);

  const {handleSubmit, setValue, getValues, setError, formState, control} =
    useForm<IJoinForm>({
      mode: 'onBlur',
    });

  const sendVerifyCode = async () => {
    const result = await createVerification({
      variables: {email: getValues('email')},
    });
    if (result.data?.createVerification.ok) {
      console.log('email sended');
    }
  };

  const onSumbit = ({email, password1, password2, code}: IJoinForm) => {};

  useEffect(() => {}, [loading]);

  useEffect(() => {
    setValue('email', 'dlgkrwns1021@naver.com');
    setValue('password1', 'test1234!');
    setValue('password2', 'test1234!');
    setValue('username', '이학준');
  }, []);
  return (
    <View style={styles.wrapper}>
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
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <BasicButton title="인증번호 발송" onPress={sendVerifyCode} />
      </View>
      {formState.errors.email?.message && (
        <TextComp text={formState.errors.email.message} />
      )}
      <View style={styles.rowBox}>
        <Controller
          name="code"
          control={control}
          rules={{}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <BasicButton title="인증" onPress={() => {}} />
      </View>
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
      {formState.errors.password1?.message && (
        <TextComp text={formState.errors.password1.message} />
      )}
      <Controller
        name="password2"
        control={control}
        rules={{
          required: '비밀번호를 입력해주세요',
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            maxLength={20}
            secureTextEntry={true}
            onChange={e => {
              console.log(getValues('password1'), getValues('password2'));
              if (getValues('password1') !== getValues('password2')) {
                setError('password2', {
                  type: 'notMatch',
                  message: '비밀번호가 다릅니다.',
                });

                onChange(e);
              }
            }}
          />
        )}
      />

      {formState.errors.password2?.message && (
        <TextComp text={formState.errors.password2.message} />
      )}
      <BasicButton title="회원가입" onPress={handleSubmit(onSumbit)} />
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
  rowBox: {
    flexDirection: 'row',
  },
  input: {
    width: '60%',
    height: 40,
    borderWidth: 2,
    borderColor: colors.PBlue,
    marginBottom: 10,
  },
});

export default LocalJoin;
