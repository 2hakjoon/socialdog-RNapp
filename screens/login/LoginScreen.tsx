import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
import GoogleLogInBtn from './components/GoogleLogInBtn';
import {User} from './components/GoogleLoginBtn';
import auth from '@react-native-firebase/auth';
import LogOutBtn from './components/LogOutBtn';
import {useNavigation} from '@react-navigation/native';

function LogInScreen() {
  const [user, setUser] = useState<User | null>();
  const navigation = useNavigation();

  function onAuthStateChanged(userData: User | null) {
    setUser(userData);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <>
      <Text>asdfjasdflajsdfl</Text>
      <GoogleLogInBtn />
      <LogOutBtn />
      {user?.email && (
        <>
          <Text>Welcome {user?.email}</Text>
          <Button
            title="산책하러가기"
            onPress={() => {
              navigation.navigate('WalkRecord');
            }}
          />
        </>
      )}
    </>
  );
}

export default LogInScreen;
