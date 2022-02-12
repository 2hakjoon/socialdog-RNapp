import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';
import {AuthNavigationProp} from '../../../routes';

function AuthHome() {
  const navigation = useNavigation<AuthNavigationProp>();
  return (
    <View>
      <Button
        title="로그인"
        onPress={() => {
          navigation.navigate('Login', {email: undefined, password: undefined});
        }}
      />
      <Button
        title="회원가입"
        onPress={() => {
          navigation.navigate('Join');
        }}
      />
    </View>
  );
}

export default AuthHome;
