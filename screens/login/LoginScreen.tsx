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

interface ILogInScreenProps {
  setUserData: Function;
}

function LogInScreen({setUserData}: ILogInScreenProps) {
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const dispatch = useDispatch();

  const createOrLogInUser = async (uid: string) => {
    setUserDataLoading(true);
    let userData = (await usersCollection.doc(uid).get()).data();
    if (userData) {
      dispatch(
        authorize({
          uid: userData.uid,
          username: userData.username,
        }),
      );
      setUserDataLoading(false);
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
          setUserDataLoading(false);
        });
    }
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  console.log(user, '여긴 login');
  return <GoogleLogInBtn authHandler={createOrLogInUser} />;
}

export default LogInScreen;
