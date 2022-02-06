import React, {useEffect} from 'react';
import GoogleLogInBtn from './components/GoogleLogInBtn';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../module';
import {authorize} from '../../module/auth';
import {usersCollection} from '../../firebase';

interface ILogInScreenProps {
  setUserData: Function;
}

export function LogInScreen({setUserData}: ILogInScreenProps) {
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

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  return <GoogleLogInBtn authHandler={createOrLogInUser} />;
}
