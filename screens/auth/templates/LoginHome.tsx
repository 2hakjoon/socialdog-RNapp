import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, View} from 'react-native';

function AuthHome() {
  const navigation = useNavigation();
  return (
    <View>
      <Button
        title="로그인"
        onPress={() => {
          navigation.navigate('login');
        }}
      />
      <Button
        title="회원가입"
        onPress={() => {
          navigation.navigate('join');
        }}
      />
    </View>
  );
}

export default AuthHome;
