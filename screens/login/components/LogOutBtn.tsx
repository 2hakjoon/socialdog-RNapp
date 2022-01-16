import React from 'react';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native';

function LogOutBtn() {
  const logOutHandler = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };
  return <Button onPress={logOutHandler} title="로그아웃" />;
}
