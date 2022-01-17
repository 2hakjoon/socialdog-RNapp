import React, {useEffect, useState} from 'react';
import {Button, Text} from 'react-native';
import GoogleLogInBtn from './components/GoogleLogInBtn';
import LogOutBtn from './components/LogOutBtn';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../module';
import {authorize} from '../../module/auth';
import {usersCollection} from '../../firebase';
import {routes} from '../../routes';

function LogInScreen() {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const createOrLogInUser = async (uid: string) => {
    let userData = (await usersCollection.doc(uid).get()).data();
    if (userData) {
      dispatch(
        authorize({
          uid: userData.uid,
          username: userData.username,
        }),
      );
    } else {
      usersCollection
        .doc(uid)
        .set({
          uid,
          username: `회원${Date.now()}`,
        })
        .then(async () => {
          userData = (await usersCollection.doc(uid).get()).data();
          dispatch(
            authorize({
              uid: userData?.uid,
              username: userData?.username,
            }),
          );
        });
    }
  };
  console.log(user);
  return (
    <>
      {user?.username ? (
        <>
          <LogOutBtn />
          <Text>Welcome {user?.username}</Text>
          <Button
            title="산책하러가기"
            onPress={() => {
              navigation.navigate(routes.record);
            }}
          />
          <Text></Text>
          <Button
            title="산책 기록 확인"
            onPress={() => {
              navigation.navigate(routes.walkRecords);
            }}
          />
        </>
      ) : (
        <GoogleLogInBtn authHandler={createOrLogInUser} />
      )}
    </>
  );
}

export default LogInScreen;
