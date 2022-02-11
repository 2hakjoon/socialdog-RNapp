import React from 'react';
import auth from '@react-native-firebase/auth';
import {Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../../module/auth';

function LogOutBtn() {
  const dispatch = useDispatch();
  const logOutHandler = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(logout);
        console.log('User signed out!');
      });
  };
  return <Button onPress={logOutHandler} title="로그아웃" />;
}

export default LogOutBtn;
