import React, {useCallback, useState} from 'react';
import {Button, Platform, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useFocusEffect} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId:
    Platform.OS === 'ios'
      ? '147772000843-uslp492a991mdig3eehts509n9fs7tst.apps.googleusercontent.com'
      : '147772000843-6b96b92gvdvovklpsn8e6v59ueqoaqcf.apps.googleusercontent.com',
});

export interface User {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata?: any;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData?: any;
  providerId: string;
  uid: string;
}

interface IGoogleLogInBtnProps {
  authHandler: (uid: string) => void;
}

function GoogleLogInBtn({authHandler}: IGoogleLogInBtnProps) {
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = async (userData: User | null) => {
    if (initializing) {
      setInitializing(false);
    }

    if (userData?.uid) {
      authHandler(userData.uid);
    }
  };

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  useFocusEffect(
    useCallback(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []),
  );

  return (
    <>
      {initializing ? (
        <Text>로그인정보를 확인중입니다....</Text>
      ) : (
        <Button
          title="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log('Signed in with Google!'),
            )
          }
        />
      )}
    </>
  );
}
export default GoogleLogInBtn;
