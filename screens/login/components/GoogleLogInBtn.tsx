import React, {useEffect, useState} from 'react';
import {Button, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '147772000843-6b96b92gvdvovklpsn8e6v59ueqoaqcf.apps.googleusercontent.com',
});

interface User {
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

function GoogleLoginBtn() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>();

  // Handle user state changes
  function onAuthStateChanged(userData: User | null) {
    setUser(userData);
    if (initializing) {
      setInitializing(false);
    }
  }

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() =>
            console.log('Signed in with Google!'),
          )
        }
      />
      {user?.email && <Text>Welcome {user?.email}</Text>}
    </>
  );
}
export default GoogleLoginBtn;
