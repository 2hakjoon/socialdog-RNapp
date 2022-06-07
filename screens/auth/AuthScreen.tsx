import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import KakaoLogin from './templates/KakaoLogin';
import {colors} from '../../utils/colors';
import {AuthScreenProps} from '../../routes';
import TextComp from '../components/TextComp';
import {mVLoginState, mVUserAccessToken} from '../../apollo-setup';
import {getData} from '../../utils/asyncStorage';
import {USER_ACCESS_TOKEN} from '../../utils/constants';
import {useLazyQuery} from '@apollo/client';
import {QMe} from '../../__generated__/QMe';
import {ME} from '../../apollo-gqls/auth';
import AntDesignIcon from '../components/Icons/AntDesign';

function AuthScreen({navigation}: AuthScreenProps<'AuthSelect'>) {
  const [meQuery, {loading: meQueryLoading}] = useLazyQuery<QMe>(ME);
  const [loginLoading, setLoginLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState<boolean>(false);

  useEffect(() => {
    // getData({key: USER_ACCESS_TOKEN}).then(token => {
    //   setLoginLoading(true);
    //   if (token) {
    //     mVUserAccessToken(token);
    //     setCheckingToken(false);
    //     meQuery().then(data => {
    //       const user = data.data?.me.data;
    //       // console.log(user);
    //       if (user) {
    //         mVLoginState(true);
    //       } else if (!data.data?.me.ok) {
    //         Alert.alert('로그인 실패', '회원정보를 찾을수 없습니다.');
    //       }
    //       setLoginLoading(false);
    //     });
    //   } else {
    //     setCheckingToken(false);
    //   }
    // });
  }, []);

  return (
    <View style={styles.wrapper}>
      <>
        <Image
          style={styles.image}
          source={require('../../assets/png/login.png')}
        />
        {checkingToken ? (
          <View style={styles.empty} />
        ) : (
          <>
            {loginLoading ? (
              <View style={styles.loading}>
                <TextComp
                  text={'로그인 중'}
                  size={18}
                  weight={'600'}
                  color={'white'}
                />
                <ActivityIndicator
                  size={'small'}
                  color="white"
                  style={{paddingLeft: 6}}
                />
              </View>
            ) : (
              <View style={styles.authButton}>
                <KakaoLogin setLoginLoading={setLoginLoading} />
                <TouchableOpacity
                  style={styles.buttonWrapper}
                  onPress={() => {
                    navigation.push('Login', {
                      email: undefined,
                      password: undefined,
                    });
                  }}>
                  <AntDesignIcon color="black" size={24} name={'user'} />
                  <View style={styles.textWrapper}>
                    <TextComp
                      text={'소셜독 계정 로그인'}
                      size={18}
                      weight={'500'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
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
  empty: {
    flex: 1.5,
    marginBottom: 50,
  },
  authButton: {
    flex: 1.5,
    justifyContent: 'center',
    marginBottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    alignItems: 'center',
    height: 50,
    width: '80%',
    backgroundColor: colors.PWhite,
    flexDirection: 'row',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  textWrapper: {
    width: '90%',
    alignItems: 'center',
  },
  loading: {
    flex: 1.5,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 50,
  },
});

export default AuthScreen;
