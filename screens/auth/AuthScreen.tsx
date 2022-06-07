import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import {getData, storeData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN} from '../../utils/constants';
import {useLazyQuery} from '@apollo/client';
import TextComp from '../components/TextComp';
import KakaoLogin from './templates/KakaoLogin';
import {QMe} from '../../__generated__/QMe';
import {mVLoginState, mVUserAccessToken} from '../../apollo-setup';
import {colors} from '../../utils/colors';
import {ME} from '../../apollo-gqls/auth';
import {AuthScreenProps} from '../../routes';

function AuthScreen({navigation}: AuthScreenProps<'AuthSelect'>) {
  const [authSelect, setAuthSelect] = useState<'kakao' | 'login' | 'join'>(
    'kakao',
  );

  return (
    <View style={styles.wrapper}>
      <>
        <Image
          style={styles.image}
          source={require('../../assets/png/login.png')}
        />

        <View style={styles.AuthButton}>
          <KakaoLogin />
          <Button
            title="소셜독 계정 로그인"
            onPress={() => {
              navigation.push('Login', {
                email: undefined,
                password: undefined,
              });
            }}
          />
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: colors.PBlue,
  },
  image: {
    width: '90%',
    height: '10%',
    flex: 6,
  },
  loading: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  AuthButton: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
});

export default AuthScreen;
